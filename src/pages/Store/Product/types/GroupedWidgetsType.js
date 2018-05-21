import { UIType, WidgetOptionType } from './index';

type GroupedWidgetsType = {
  [UIType]: {
    title: string,
    uiElement: string,
    options: Array<WidgetOptionType>,
  },
};

export default GroupedWidgetsType;
