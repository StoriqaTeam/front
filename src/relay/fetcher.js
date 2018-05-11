import fetch from 'isomorphic-fetch';
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

  async fetch(operation, variables) {
    log.debug('GraphQL request', { url: this.url, operation, variables });
    const jwt = this.getJWTFromCookies();
    const headers = { 'Content-Type': 'application/json' };
    try {
      const response = await fetch(this.url, {
        method: 'POST',
        headers: jwt
          ? assoc('Authorization', `Bearer ${jwt}`, headers)
          : headers,
        body: JSON.stringify({ query: operation.text, variables }),
      });
      log.debug('GraphQL response', { response });
      return response.json();
    } catch (e) {
      log.error('GraphQL fetching error: ', { error: e });
      return {};
    }
  }
}

export class ServerFetcher extends FetcherBase {
  constructor(url, jwt) {
    super(url);

    this.jwt = jwt;
    this.payloads = [];
  }

  getJWTFromCookies() {
    return this.jwt;
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

  async fetch(...args) {
    if (this.payloads.length) {
      return this.payloads.shift();
    }

    return super.fetch(...args);
  }
}
