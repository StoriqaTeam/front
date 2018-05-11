import { UIType, SelectedType } from './index';

type WidgetsType = {
  [UIType]: {
    title: string,
    uiElement: string,
    values: Array<SelectedType>,
    valuesWithImages: Array<{ id: string, img: string }>,
  },
};

export default WidgetsType;
