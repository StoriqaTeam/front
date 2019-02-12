// @flow

import axios from 'axios';
import Cookies from 'universal-cookie';
import { assoc, pathOr, slice, omit } from 'ramda';
import uidGenerator from 'gen-uid';

import isTokenExpired from 'utils/token';
import { log, removeCookie, jwt as JWT } from 'utils';
import grayLogger from 'utils/graylog';
import { COOKIE_CURRENCY, COOKIE_FIAT_CURRENCY } from 'constants';

import type { CookieType } from 'utils/cookiesOp';

import {
  isJwtExpiredErrorInResponse,
  isJwtRevokedInResponse,
} from './fetcher.utils';

export class FetcherBase {
  url: string;

  constructor(url: string) {
    this.url = url;
  }

  // eslint-disable-next-line
  getCookies(): ?CookieType {
    return null;
  }

  // eslint-disable-next-line
  getJWTFromCookies(): ?string {
    throw new Error('should be implemented in subclasses');
  }

  // eslint-disable-next-line
  getSessionIdFromCookies(): string {
    throw new Error('should be implemented in subclasses');
  }

  // eslint-disable-next-line
  getCurrencyCodeFromCookies() {
    throw new Error('should be implemented in subclasses');
  }

  // eslint-disable-next-line
  getFiatCurrencyCodeFromCookies() {
    throw new Error('should be implemented in subclasses');
  }

  // eslint-disable-next-line
  getCorrelationToken() {
    throw new Error('should be implemented in subclasses');
  }

  prepareHeaders = (): { [string]: string } => {
    const jwt = this.getJWTFromCookies();
    const currency = this.getCurrencyCodeFromCookies();
    const fiatCurrency = this.getFiatCurrencyCodeFromCookies();

    let headers = {
      'Content-Type': 'application/json',
      Currency: currency || 'STQ',
      FiatCurrency: fiatCurrency || 'USD',
    };

    if (jwt) {
      headers = assoc('Authorization', `Bearer ${jwt}`, headers);
    }

    if (this.getCorrelationToken()) {
      headers = assoc('correlation-token', this.getCorrelationToken(), headers);
    }

    const sessionId = this.getSessionIdFromCookies();
    headers = assoc('Session-Id', sessionId, headers);

    if (!process.env.BROWSER && process.env.NODE_ENV !== 'production') {
      headers = assoc('Cookie', 'holyshit=iamcool', headers);
    }

    return headers;
  };

  logRequest = (data: {
    url: string,
    headers: { [string]: string },
    uid: string,
    operation: { name: string, text: string },
    variables: { [string]: any },
  }) => {
    log.debug('GraphQL request', data);
    grayLogger.info('GraphQL request', {
      uid: data.uid,
      url: this.url,
      operationName: data.operation.name,
      operationText: slice(0, 32000, data.operation.text),
      operationVariables: JSON.stringify(data.variables),
      headers: JSON.stringify(omit(['Authorization'], data.headers), null, 2),
    });
  };

  async fetch(operation: { name: string, text: string }, variables: {}) {
    const cookies = this.getCookies() || new Cookies();
    const uid = uidGenerator.v4();
    const headers = this.prepareHeaders();

    this.logRequest({
      url: this.url,
      headers,
      uid,
      operation,
      variables,
    });

    try {
      const response = await axios({
        method: 'post',
        url: this.url,
        headers,
        data: JSON.stringify({ query: operation.text, variables }),
        withCredentials: true,
        // timeout: process.env.NODE_ENV !== 'production' ? 30000 : 0,
      });
      log.debug('GraphQL response', { uid, ...response.data });

      grayLogger.info('GraphQL response', {
        uid,
        response: slice(0, 32000, JSON.stringify(response.data, null, 2)),
      });

      if (isJwtExpiredErrorInResponse(response.data)) {
        log.debug('JwtExpiredErrorInResponse');
        const newTokenResponse = await axios({
          method: 'post',
          url: this.url,
          headers,
          data: JSON.stringify({
            query: 'mutation RefreshJWTMutation { refreshJWT }',
          }),
          withCredentials: true,
        });
        log.debug({ newToken: newTokenResponse.data });
        if (
          newTokenResponse &&
          newTokenResponse.data &&
          newTokenResponse.data.data &&
          newTokenResponse.data.data.refreshJWT
        ) {
          JWT.setJWT(newTokenResponse.data.data.refreshJWT, cookies);
          const updatedHeaders = {
            ...headers,
            Authorization: `Bearer ${newTokenResponse.data.data.refreshJWT}`,
          };
          this.logRequest({
            url: this.url,
            headers: updatedHeaders,
            uid,
            operation,
            variables,
          });
          const responseWithRefreshedJWT = await axios({
            method: 'post',
            url: this.url,
            headers: updatedHeaders,
            data: JSON.stringify({ query: operation.text, variables }),
            withCredentials: true,
          });

          log.debug('GraphQL response', {
            uid,
            ...responseWithRefreshedJWT.data,
          });
          grayLogger.info('GraphQL response', {
            uid,
            response: slice(
              0,
              32000,
              JSON.stringify(responseWithRefreshedJWT.data, null, 2),
            ),
          });

          return responseWithRefreshedJWT.data;
        }
        log.debug({ newToken: newTokenResponse.data });
      }

      if (isJwtRevokedInResponse(response.data)) {
        removeCookie('__jwt', cookies);
        const updatedHeaders = omit(['Authorization'], headers);
        this.logRequest({
          url: this.url,
          headers: updatedHeaders,
          uid,
          operation,
          variables,
        });
        const responseWithoutJWT = await axios({
          method: 'post',
          url: this.url,
          headers: updatedHeaders,
          data: JSON.stringify({ query: operation.text, variables }),
          withCredentials: true,
        });

        log.debug('GraphQL response', {
          uid,
          ...responseWithoutJWT.data,
        });
        grayLogger.info('GraphQL response', {
          uid,
          response: slice(
            0,
            32000,
            JSON.stringify(responseWithoutJWT.data, null, 2),
          ),
        });

        return responseWithoutJWT.data;
      }

      return response.data;
    } catch (e) {
      log.error('GraphQL fetching error: ', { error: e });
      grayLogger.error('GraphQL fetching error', {
        uid,
        error: e,
      });
      return { data: null, errors: ['No data returned from gateway'] };
    }
  }
}

export class ServerFetcher extends FetcherBase {
  url: string;
  jwt: ?string;
  sessionId: string;
  currencyCode: string;
  fiatCurrencyCode: string;
  correlationToken: ?string;
  payloads: Array<any>;
  cookiesInstance: CookieType;

  constructor(
    url: string,
    sessionId: string,
    currencyCode: string,
    fiatCurrencyCode: string,
    correlationToken: ?string,
    cookiesInstance: CookieType,
  ) {
    super(url);
    this.url = url;
    this.sessionId = sessionId;
    this.currencyCode = currencyCode;
    this.fiatCurrencyCode = fiatCurrencyCode;
    this.payloads = [];
    this.correlationToken = correlationToken;
    this.cookiesInstance = cookiesInstance;
  }

  getCookies() {
    return this.cookiesInstance;
  }

  getJWTFromCookies() {
    return pathOr(null, ['value'])(this.cookiesInstance.get('__jwt'));
  }

  getSessionIdFromCookies() {
    return this.sessionId;
  }

  getCurrencyCodeFromCookies() {
    return this.currencyCode;
  }

  getFiatCurrencyCodeFromCookies() {
    return this.fiatCurrencyCode;
  }

  getCorrelationToken() {
    return this.correlationToken;
  }

  async fetch(...args: any) {
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
  payloads: Array<any>;

  constructor(url: string, payloads: Array<any>) {
    super(url);
    this.url = url;
    this.payloads = payloads;
  }

  // eslint-disable-next-line
  getJWTFromCookies() {
    const cookies = new Cookies();
    const jwt = pathOr(null, ['value'])(cookies.get(JWT.jwtCookieName));
    if (isTokenExpired(jwt)) {
      removeCookie(JWT.jwtCookieName, cookies);
    }
    return pathOr(null, ['value'])(cookies.get(JWT.jwtCookieName));
  }

  // eslint-disable-next-line
  getSessionIdFromCookies() {
    const cookies = new Cookies();
    return cookies.get('SESSION_ID');
  }

  // eslint-disable-next-line
  getCurrencyCodeFromCookies() {
    const cookies = new Cookies();
    const currency = cookies.get(COOKIE_CURRENCY);
    return currency || 'STQ';
  }
  // eslint-disable-next-line
  getFiatCurrencyCodeFromCookies() {
    const cookies = new Cookies();
    const currency = cookies.get(COOKIE_FIAT_CURRENCY);
    return currency || 'USD';
  }

  // eslint-disable-next-line
  getCorrelationToken() {
    return null;
  }

  async fetch(...args: any) {
    if (this.payloads.length) {
      return this.payloads.shift();
    }
    return super.fetch(...args);
  }
}
