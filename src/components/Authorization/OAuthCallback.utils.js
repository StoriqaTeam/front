// @flow strict

import { replace } from 'ramda';

export type PrepareQueryStringInputType = {
  url: string,
  callbackUrl: string,
};

const prepareQueryString = (input: PrepareQueryStringInputType): string => {
  const { url, callbackUrl } = input;
  const queryString = replace(`${callbackUrl}#`, '', url);
  if (queryString && !queryString.startsWith(callbackUrl)) {
    return queryString;
  }
  return replace(`${callbackUrl}?#`, '', url);
};

export default prepareQueryString;
