// @flow

import Cookies from 'universal-cookie';

const cookies = new Cookies();

export const setCookie = (name: string, value: any, expires: any) => {
  let options = { path: '/' };
  if (expires) {
    options = { ...options, expires };
  }
  cookies.set(name, value, { ...options });
};

export const removeCookie = (name: string) => {
  cookies.remove(name, { path: '/' });
};

export const getCookie = (name: string) => cookies.get(name);
