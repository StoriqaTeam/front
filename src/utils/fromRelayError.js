// @flow strict

import {
  map,
  pathOr,
  fromPairs,
  toString,
  mapObjIndexed,
  isEmpty,
  filter,
  complement,
  isNil,
} from 'ramda';

export type ProcessedErrorType = {
  ['100' | '200' | '300' | '400']: {
    status: string,
    messages?: {
      [string]: Array<string>,
    },
  },
};

type RelayAPIErrorType = {
  code: 100,
  details: {
    status: string,
    message?: string,
  },
};

type RelayDefaultErrorType = {
  code: 200 | 300 | 400,
  details: string,
};

type RelayErrorType = {
  source?: ?{
    errors?: ?Array<{
      data: RelayAPIErrorType | RelayDefaultErrorType,
    }>,
  },
};

/*
  see tests
*/
const processError = (relayError: RelayErrorType): ?ProcessedErrorType => {
  // $FlowIgnoreMe
  const errorsArr = pathOr([], ['source', 'errors'], relayError);

  if (isEmpty(errorsArr)) {
    return null;
  }

  const convertedErrors = map(item => {
    const error = item.data;

    if (!error) {
      return null;
    }

    const { code } = error;

    if (code !== 100) {
      return [toString(code), { status: (error && error.details) || item }];
    }

    const status = pathOr('', ['details', 'status'], error);
    const messagesRaw = pathOr('', ['details', 'message'], error);
    let messagesData;

    try {
      messagesData = JSON.parse(messagesRaw);
    } catch (e) {
      //
    }

    const messages = {};
    try {
      const prependKeyAndDouble = (val, key) => {
        // eslint-disable-line
        messages[key] = map(i => i.message, val);
      };
      mapObjIndexed(prependKeyAndDouble, messagesData);
    } catch (e) {
      //
    }
    return [toString(code), { status, messages }];
  }, errorsArr);
  // $FlowIgnoreMe
  return fromPairs(filter(complement(isNil), convertedErrors));
};

export default processError;
