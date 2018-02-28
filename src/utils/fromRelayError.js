// @flow

import { map, pathOr, pipe, prop, head, fromPairs, toString } from 'ramda';

/*
  see test
*/
export default pipe(
  pathOr([], ['source', 'errors']),
  map((item) => {
    const error = prop('data', item);
    const code = prop('code', error);
    const status = pathOr('', ['details', 'status'], error);
    const messageRaw = pathOr('', ['details', 'message'], error);
    const message = map(pipe(
      head,
      prop('message'),
    ))(JSON.parse(messageRaw));
    return [toString(code), {
      status,
      message,
    }];
  }),
  fromPairs,
);
