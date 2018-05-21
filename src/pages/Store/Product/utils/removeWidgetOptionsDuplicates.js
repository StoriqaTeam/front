import { map, prop, uniqBy } from 'ramda';
import { WidgetType } from '../types';

const removeWidgetOptionsDuplicates = (
  widgets: Array<WidgetType>,
): Array<WidgetType> =>
  map(
    (widget: WidgetType): Array<WidgetType> => ({
      ...widget,
      options: uniqBy(prop('label'), widget.options),
    }),
    widgets,
  );

export default removeWidgetOptionsDuplicates;
