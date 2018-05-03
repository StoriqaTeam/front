// @flow

import {
  map,
  pathOr,
  pipe,
  prop,
  fromPairs,
  toString,
  mapObjIndexed,
} from 'ramda';

export type ProcessedErrorType = {
  [100 | 200 | 300 | 400]: {
    status: string,
    messages?: {
      [string]: Array<string>,
    },
  },
};

// type DetailedErrorType = {
//   code: number,
//   details: {

//   },
// };

// type RelayErrorType = {
//   source: {
//     errors: Array<{
//       data: DetailedErrorType | string,
//     }>,
//   },
// };
/*
  see test
*/
export default pipe(
  pathOr([], ['source', 'errors']),
  map(item => {
    // $FlowIgnoreMe
    const error = prop('data', item);
    const code = prop('code', error);

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
      // eslint-disable-next-line
      alert('Something going wrong :(');
    }
    return [toString(code), { status, messages }];
  }),
  fromPairs,
);
