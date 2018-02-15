// @flow

import { fromPairs, map, pathOr, pipe, prop } from 'ramda';

export default pipe(
  pathOr([], ['source', 'errors']),
  map((item) => {
    const error = prop('data', item);
    return [prop('code', error), pathOr('', ['details', 'status'], error)];
  }),
  fromPairs,
);
