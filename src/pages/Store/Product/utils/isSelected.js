import { any, pipe, prop, propEq, map, flatten } from 'ramda';

import type { WidgetType } from '../types';

const isSelected = (widgets: Array<WidgetType>): boolean =>
  pipe(map(prop('options')), flatten, any(propEq('state', 'selected')))(
    widgets,
  );

export default isSelected;
