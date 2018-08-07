import { propEq, map, find, filter, isEmpty } from 'ramda';

import type { WidgetType } from '../types';

const isNoSelected = (widgets: Array<WidgetType>): boolean => {
  const noSelectedArr = filter(
    item => item,
    map(item => {
      const { title, options } = item;
      return !find(propEq('state', 'selected'))(options) ? title : false;
    }, widgets),
  );

  return isEmpty(noSelectedArr) ? null : noSelectedArr;
};

export default isNoSelected;
