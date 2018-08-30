import axios from 'axios';
import Cookies from 'universal-cookie';
import { assoc, pathOr } from 'ramda';

import isTokenExpired from 'utils/token';
import { log, removeCookie, getCookie } from 'utils';

class FetcherBase {
  constructor(url) {
    this.url = url;
  }

  // eslint-disable-next-line
  getJWTFromCookies() {
    throw new Error('should be implemented in subclasses');
  }

  // eslint-disable-next-line
  getSessionIdFromCookies() {
    throw new Error('should be implemented in subclasses');
  }

  // eslint-disable-next-line
  getCurrencyCodeFromCookies() {
    throw new Error('should be implemented in subclasses');
  }

  async fetch(operation, variables) {
    log.debug('GraphQL request', { url: this.url, operation, variables });
    const jwt = this.getJWTFromCookies();
    const currency = this.getCurrencyCodeFromCookies();

    let headers = { 'Content-Type': 'application/json' };
    if (jwt) {
      headers = assoc('Authorization', `Bearer ${jwt}`, headers);
    }

    headers = assoc('Currency', currency || 'STQ', headers);

    const sessionId = this.getSessionIdFromCookies();
    headers = assoc('Session-Id', sessionId, headers);

    log.debug('\nRequest headers:\n', { headers }, '\n');

    try {
      const response = await axios({
        method: 'post',
        url: this.url,
        headers,
        data: JSON.stringify({ query: operation.text, variables }),
        withCredentials: true,
      });
      log.debug('GraphQL response', { response: response.data });
      return response.data;
    } catch (e) {
      log.error('GraphQL fetching error: ', { error: e });
      return { data: null, errors: ['No data returned from gateway'] };
    }
  }
}

export class ServerFetcher extends FetcherBase {
  constructor(url, jwt, sessionId, currencyCode) {
    super(url);

    this.jwt = jwt;
    this.sessionId = sessionId;
    this.currencyCode = currencyCode;
    this.payloads = [];
  }

  getJWTFromCookies() {
    return this.jwt;
  }

  getSessionIdFromCookies() {
    return this.sessionId;
  }

  getCurrencyCodeFromCookies() {
    return this.currencyCode;
  }

  async fetch(...args) {
    const i = this.payloads.length;
    this.payloads.push(null);
    const payload = await super.fetch(...args);
    this.payloads[i] = payload;
    return payload;
  }

  toJSON() {
    return this.payloads;
  }
}

export class ClientFetcher extends FetcherBase {
  constructor(url, payloads) {
    super(url);

    this.payloads = payloads;
  }

  // eslint-disable-next-line
  getJWTFromCookies() {
    const jwt = pathOr(null, ['value'], getCookie('__jwt'));
    if (isTokenExpired(jwt)) {
      removeCookie('__jwt');
    }
    return pathOr(null, ['value'], getCookie('__jwt'));
  }

  // eslint-disable-next-line
  getSessionIdFromCookies() {
    const cookies = new Cookies();
    return cookies.get('SESSION_ID');
  }

  // eslint-disable-next-line
  getCurrencyCodeFromCookies() {
    const cookies = new Cookies();
    const currency = cookies.get('CURRENCY');
    return currency || 'STQ';
  }

  async fetch(...args) {
    if (this.payloads.length) {
      return this.payloads.shift();
    }
    return super.fetch(...args);
  }
}
