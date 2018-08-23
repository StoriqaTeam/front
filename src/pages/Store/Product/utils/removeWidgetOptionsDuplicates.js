// @flow

import { map, prop, uniqBy } from 'ramda';
import type { WidgetType } from '../types';

const removeWidgetOptionsDuplicates = (
  widgets: Array<WidgetType>,
): Array<WidgetType> =>
  // $FlowIgnoreMe
  map(
    // $FlowIgnoreMe
    (widget: WidgetType): Array<WidgetType> => ({
      ...widget,
      options: uniqBy(prop('label'), widget.options),
    }),
    widgets,
  );

export default removeWidgetOptionsDuplicates;
