// @flow

import type { WidgetOptionType } from './index';

export type WidgetType = {
  id: string,
  title: string,
  uiElement: string,
  options: Array<WidgetOptionType>,
};
