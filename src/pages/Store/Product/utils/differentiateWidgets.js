// @flow

import {
  addIndex,
  ascend,
  // $FlowIgnoreMe
  chain,
  concat,
  difference,
  map,
  mergeDeepWithKey,
  pipe,
  prop,
  propEq,
  sortWith,
} from 'ramda';

import { makeWidgets, removeWidgetOptionsDuplicates } from './index';
import { VariantType, WidgetType, WidgetOptionType } from '../types';

const differentiateWidgets: (
  Array<WidgetOptionType>,
) => (Array<VariantType>) => Array<WidgetType> = selections => variants => {
  const sortByTitle: (Array<WidgetType>) => Array<WidgetType> = sortWith([
    ascend(prop('title')),
  ]);

  const widgetsEmpty = sortByTitle(makeWidgets([])(variants));

  const filteredWidgets = sortByTitle(makeWidgets(selections)(variants));

  const mapIndexed = addIndex(map);

  const updateWidgetsOptionsState = (
    widgets: Array<WidgetType>,
  ): Array<WidgetType> => {
    const updateWidgetSelection: WidgetOptionType => WidgetType => Array<
      WidgetType,
    > = selection => widget => {
      if (widget.id === selection.id) {
        const setSelectedState = (option: WidgetOptionType) =>
          propEq('label', selection.value)(option)
            ? { ...option, state: 'selected' }
            : option;
        const options = map(setSelectedState, widget.options);
        return { ...widget, options };
      }
      return widget;
    };
    const mapSelections = (selection: WidgetOptionType) =>
      map(updateWidgetSelection(selection), widgets);
    return chain(mapSelections, selections);
  };

  const differentiateOption = (
    widgets: Array<WidgetType>,
  ): Array<WidgetOptionType> => widgets.map((widget, index) => {
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
  });

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
    differentiateOption,
    mergeWidgetsOptions(filteredWidgets),
    removeWidgetOptionsDuplicates,
    updateWidgetsOptionsState,
  )(widgetsEmpty);
};

export default differentiateWidgets;
