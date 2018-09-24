// @flow

import { find, propEq } from 'ramda';

import type { SelectItemType } from 'types';

export default (list: Array<SelectItemType>, id: string) => {
  const item = find(propEq('id', `${id}`))(list);
  return item || null;
};
