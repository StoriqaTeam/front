import fetch from 'isomorphic-fetch';
import Cookies from 'universal-cookie';
import { assoc, pathOr } from 'ramda';

class FetcherBase {
  constructor(url) {
    this.url = url;
  }

  // eslint-disable-next-line
  getJWTFromCookies() {
    throw new Error('should be implemented in subclasses');
  }

  async fetch(operation, variables) {
    const headers = {
      'Content-Type': 'application/json',
    };
    const jwt = this.getJWTFromCookies();
    console.log({ headers: jwt ? assoc('Authorization', `Bearer ${jwt}`, headers) : headers });
    const response = await fetch(this.url, {
      method: 'POST',
      headers: jwt ? assoc('Authorization', `Bearer ${jwt}`) : headers,
      body: JSON.stringify({ query: operation.text, variables }),
    });
    return response.json();
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
