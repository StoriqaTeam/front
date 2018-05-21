// @flow

import { ascend, prop, sortWith } from 'ramda';
import { WidgetOptionType } from '../types';

const sortByProp: (
  string,
) => Array<WidgetOptionType> => Array<WidgetOptionType> = propName =>
  sortWith([ascend(prop(propName))]);

export default sortByProp;
