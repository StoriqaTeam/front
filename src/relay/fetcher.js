import axios from 'axios';
import Cookies from 'universal-cookie';
import { assoc, pathOr } from 'ramda';

import { log } from 'utils';

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

  async fetch(operation, variables) {
    log.debug('GraphQL request', { url: this.url, operation, variables });
    const jwt = this.getJWTFromCookies();
    let headers = { 'Content-Type': 'application/json' };
    if (jwt) {
      headers = assoc('Authorization', `Bearer ${jwt}`, headers);
    }
    const sessionId = this.getSessionIdFromCookies();
    headers = {
      ...headers,
      'Session-Id': sessionId,
    };
    try {
      const response = await axios({
        method: 'post',
        url: this.url,
        headers,
        data: JSON.stringify({ query: operation.text, variables }),
      });
      log.debug('GraphQL response', { response: response.data });
      return response.data;
    } catch (e) {
      log.error('GraphQL fetching error: ', { error: e });
      return {};
    }
  }
}

export class ServerFetcher extends FetcherBase {
  constructor(url, jwt, sessionId) {
    super(url);

    this.jwt = jwt;
    this.sessionId = sessionId;
    this.payloads = [];
  }

  getJWTFromCookies() {
    return this.jwt;
  }

  getSessionIdFromCookies() {
    return this.sessionId;
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
    const cookies = new Cookies();
    return pathOr(null, ['value'], cookies.get('__jwt'));
  }

  // eslint-disable-next-line
  getSessionIdFromCookies() {
    const cookies = new Cookies();
    return cookies.get('SESSION_ID');
  }

  async fetch(...args) {
    if (this.payloads.length) {
      return this.payloads.shift();
    }

    return super.fetch(...args);
  }
}
