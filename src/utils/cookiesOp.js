// @flow

import Cookies from 'universal-cookie';

export const setCookie = (name: string, value: any, expires: any) => {
  let options = { path: '/' };
  if (expires) {
    options = { ...options, expires };
  }

  const cookies = new Cookies();
  cookies.set(name, value, { ...options });
};

export const removeCookie = (name: string) => {
  const cookies = new Cookies();
  cookies.remove(name, { path: '/' });
};

export const getCookie = (name: string) => {
  const cookies = new Cookies();
  return cookies.get(name);
};
