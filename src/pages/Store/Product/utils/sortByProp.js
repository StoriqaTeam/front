import { ascend, prop, sortWith } from 'ramda';
import { WidgetOptionType } from '../types';

const sortByProp: (
  Array<WidgetOptionType>,
) => string => Array<WidgetOptionType> = propName =>
  sortWith([ascend(prop(propName))]);

export default sortByProp;
