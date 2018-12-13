// @flow strict

import { filter, pathEq, isEmpty } from 'ramda';

const codes = {
  jwtExpired: 111,
  jwtRevoked: 112,
};

// indicates that user should refresh current token
const isJwtExpiredErrorInResponse = (
  response: ?{ errors?: Array<{}> },
): boolean => {
  const isErrorExists =
    response && response.errors && response.errors instanceof Array;

  if (isErrorExists == null || isErrorExists === false) {
    return false;
  }

  const errorsWith111Code = filter(
    pathEq(['data', 'code'], codes.jwtExpired),
    (response && response.errors) || [],
  );

  return !isEmpty(errorsWith111Code);
};

// indicates that token can not be refreshed anymore
const isJwtRevokedInResponse = (response: ?{ errors?: Array<{}> }): boolean => {
  const isErrorExists =
    response && response.errors && response.errors instanceof Array;

  if (isErrorExists == null || isErrorExists === false) {
    return false;
  }

  const errorsWith112Code = filter(
    pathEq(['data', 'code'], codes.jwtRevoked),
    (response && response.errors) || [],
  );

  return !isEmpty(errorsWith112Code);
};

export { isJwtExpiredErrorInResponse, isJwtRevokedInResponse };
