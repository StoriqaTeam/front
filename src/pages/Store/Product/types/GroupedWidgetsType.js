// @flow

import { UIType, WidgetOptionType } from './index';

export type GroupedWidgetsType = {
  [UIType]: {
    title: string,
    uiElement: string,
    options: Array<WidgetOptionType>,
  },
};
