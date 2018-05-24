// @flow

import { ascend, prop, sortWith } from 'ramda';
import type { WidgetType } from '../types';

const sortByProp: string => (
  Array<WidgetType>,
  // $FlowIgnoreMe
) => Array<WidgetType> = propName => sortWith([ascend(prop(propName))]);

export default sortByProp;
