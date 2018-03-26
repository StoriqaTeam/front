// @flow

import { curry, pipe, map, adjust, fromPairs, toPairs, addIndex, reduce } from 'ramda';

const rename = curry((fn, obj) => pipe(toPairs, map(adjust(fn, 0)), fromPairs)(obj));

export const renameCamelCase = (obj: any) => {
  const reduceIndexed = addIndex(reduce);
  const func = val =>
    reduceIndexed((acc, next, index) => {
      if (index === 0) return next;
      return acc + next[0].toUpperCase() + next.slice(1).toLowerCase();
    }, '', val.split('_'));
  return rename(func, obj);
};

export default rename;
