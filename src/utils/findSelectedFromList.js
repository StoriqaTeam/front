// @flow

import { find, propEq } from 'ramda';

import type { SelectType } from 'types';

export default (list: Array<SelectType>, id: number) => {
  const item = find(propEq('id', `${id}`))(list);
  return item || null;
};
