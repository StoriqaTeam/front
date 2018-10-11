// @flow

import { ascend, prop, sortWith } from 'ramda';
import type { WidgetType } from '../types';

const sortByProp = (propName: string) => (
  arr: Array<WidgetType>,
): Array<WidgetType> => {
  const comparator = ascend(prop(propName));
  const sort: Function = sortWith([comparator]);
  return sort(arr);
};

export default sortByProp;
