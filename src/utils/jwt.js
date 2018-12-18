// @flow strict

import { setCookie, removeCookie, log } from 'utils';

import type { CookieType } from 'utils/cookiesOp';

const expirationTimeInDays = 14;
const jwtCookieName = '__jwt';

const clearJWT = () => {
  removeCookie(jwtCookieName);
};

const setJWT = (jwt: string, cookiesInstance?: CookieType): void => {
  log.debug('setJWT', jwt);
  const date = new Date();
  const today = date;
  const expirationDate = date;
  expirationDate.setDate(today.getDate() + expirationTimeInDays);
  removeCookie(jwtCookieName, cookiesInstance);
  setCookie(jwtCookieName, { value: jwt }, expirationDate, cookiesInstance);
};

export default { setJWT, clearJWT, jwtCookieName };
