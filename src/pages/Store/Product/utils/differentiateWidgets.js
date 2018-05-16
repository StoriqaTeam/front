import {
  addIndex,
  ascend,
  concat,
  difference,
  map,
  mergeDeepWithKey,
  pipe,
  prop,
  sortWith,
} from 'ramda';

import { makeWidgets, removeWidgetOptionsDuplicates } from './index';
import { VariantType, WidgetType, WidgetOptionType } from '../types';

const differentiateWidgets: (
  Array<SelectionType>,
) => (Array<VariantType>) => Array<WidgetType> = selections => variants => {
  const sortByTitle: (Array<WidgetType>) => Array<WidgetType> = sortWith([
    ascend(prop('title')),
  ]);

  const widgetsEmpty = sortByTitle(makeWidgets([])(variants));

  const filteredWidgets = sortByTitle(makeWidgets(selections)(variants));

  const mapIndexed = addIndex(map);

  const differentiateOption = (
    widget: WidgetType,
    index: number,
  ): Array<WidgetOptionType> => {
    const diffedOptions = difference(widget.options)(
      filteredWidgets[index].options,
    );
    const disableOptions = map(
      option => ({ ...option, state: 'disable' }),
      diffedOptions,
    );
    return {
      ...widget,
      options: disableOptions,
    };
  };

  const mergeWidgetsOptions = (diffWidgets: Array<WidgetType>) => (
    widgets: Array<WidgetType>,
  ): Array<WidgetType> => {
    const mergeOptions = (
      key: string,
      leftOption: WidgetType,
      rightOption: WidgetType,
    ): WidgetOptionType =>
      key === 'options' ? concat(leftOption, rightOption) : rightOption;

    const mergeWidgetOptions = (
      leftOption: WidgetType,
      rightOption: WidgetType,
    ): WidgetType => mergeDeepWithKey(mergeOptions, leftOption, rightOption);

    const applyMerge = (widget: WidgetType, index: number): Array<WidgetType> =>
      mergeWidgetOptions(widget, diffWidgets[index]);

    return mapIndexed(applyMerge, widgets);
  };

  return pipe(
    mapIndexed(differentiateOption),
    mergeWidgetsOptions(filteredWidgets),
    removeWidgetOptionsDuplicates,
  )(widgetsEmpty);
};

export default differentiateWidgets;
