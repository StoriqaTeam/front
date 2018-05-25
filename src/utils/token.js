// @flow

import Cookies from 'universal-cookie';
import { pathOr } from 'ramda';
import jwtDecode from 'jwt-decode';

type TokenType = {
  user_id: number,
  exp: number,
};

/*
  token: jwt-string from cookes
  liveTime: amount of seconds since creation when token is actual
            (24 hours by default)
*/
const isTokenExpired = (
  token: ?string,
  liveTime: number = 24 * 60 * 60,
): boolean => {
  if (!token) {
    return true;
  }
  let decodedJWT: ?TokenType;
  try {
    decodedJWT = jwtDecode(token);
  } catch (e) {
    //
  }
  // $FlowIgnoreMe
  const expiredAt: ?number = pathOr(null, ['exp'], decodedJWT);
  if (!expiredAt) {
    return true;
  }

  const currentTimestamp = parseInt(Date.now() / 1000, 10);
  return currentTimestamp - expiredAt > liveTime;
};

const getTokenFromCookies = (): ?string => {
  const cookies = new Cookies();
  // $FlowIgnoreMe
  return pathOr(null, ['value'], cookies.get('__jwt'));
};

export default {
  isTokenExpired,
  getTokenFromCookies,
};
