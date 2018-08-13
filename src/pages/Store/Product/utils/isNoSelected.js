import { map, filter, isEmpty, has } from 'ramda';

import type { WidgetType } from '../types';

const isNoSelected = (
  widgets: Array<WidgetType>,
  selectedAttributes: ?{ [string]: string },
) => {
  const noSelectedArr = map(
    item => item.title,
    filter(item => !has(item.id)(selectedAttributes), widgets),
  );
  return isEmpty(noSelectedArr) ? null : noSelectedArr;
};

export default isNoSelected;
