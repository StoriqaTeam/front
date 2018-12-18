// @flow

import Cookies from 'universal-cookie';

export type CookieType = {
  remove: (key: string, opts?: {}) => void,
  set: (key: string, val: string, opts?: {}) => void,
  get: (key: string) => ?any,
};

export const setCookie = (
  name: string,
  value: any,
  expires: any,
  cookiesInstance?: CookieType,
) => {
  let options = { path: '/' };
  if (expires) {
    options = { ...options, expires };
  }

  const cookies = cookiesInstance || new Cookies();
  cookies.set(name, value, { ...options });
};

export const removeCookie = (name: string, cookiesInstance?: CookieType) => {
  const cookies = cookiesInstance || new Cookies();
  cookies.remove(name, { path: '/' });
};

export const getCookie = (name: string) => {
  const cookies = new Cookies();
  return cookies.get(name);
};
