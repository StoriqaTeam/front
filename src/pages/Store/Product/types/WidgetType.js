import { WidgetOptionType } from './index';

type WidgetType = {
  id: string,
  title: string,
  uiElement: string,
  options: Array<WidgetOptionType>,
};

export default WidgetType;
