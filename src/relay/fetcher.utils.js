// @flow strict

import { filter, pathEq, isEmpty } from 'ramda';

const codes = {
  jwtExpired: 111,
};

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

export { isJwtExpiredErrorInResponse };
