// @flow

import { map, pathOr, pipe, prop, fromPairs, toString, mapObjIndexed } from 'ramda';

/*
  see test
*/
export default pipe(
  pathOr([], ['source', 'errors']),
  map((item) => {
    const error = prop('data', item);
    const code = prop('code', error);

    if (code !== 100) {
      return [toString(code), { message: error.details }];
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
      const prependKeyAndDouble = (item, key, obj) => {// eslint-disable-line
        messages[key] = map(i => i.message, item);
      };
      mapObjIndexed(prependKeyAndDouble, messagesData);
    } catch (e) {
      alert('Something going wrong :(');
    }
    return [toString(code), { status, messages }];
  }),
  fromPairs,
);
