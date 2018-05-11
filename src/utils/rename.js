// @flow

import {
  curry,
  pipe,
  map,
  adjust,
  fromPairs,
  toPairs,
  addIndex,
  reduce,
} from 'ramda';

const rename = curry((fn: Function, obj: Object) =>
  pipe(toPairs, map(adjust(fn, 0)), fromPairs)(obj),
);

export const renameCamelCase = (obj: any) => {
  // $FlowIgnore
  const reduceIndexed = addIndex(reduce);
  const func = (val: string) =>
    reduceIndexed(
      (acc, next, index) => {
        if (index === 0) return next;
        // $FlowIgnore
        return acc + next[0].toUpperCase() + next.slice(1).toLowerCase();
      },
      // $FlowIgnore
      '',
      // $FlowIgnore
      val.split('_'),
    );
  return rename(func, obj);
};

export default rename;
