// @flow

import {
  // $FlowIgnoreMe
  chain,
  concat,
  difference,
  map,
  mergeDeepWithKey,
  pipe,
  propEq,
} from 'ramda';

import { makeWidgets, removeWidgetOptionsDuplicates, sortByProp } from './index';
import type { VariantType, WidgetType, WidgetOptionType, SelectionType } from '../types';

const differentiateWidgets: (
  Array<WidgetOptionType>,
) => (Array<VariantType>) => Array<WidgetType> = selections => variants => {

  const widgetsEmpty = sortByProp('title')(makeWidgets([])(variants));

  const filteredWidgets = sortByProp('title')(makeWidgets(selections)(variants));

  const updateWidgetsOptionsState = (
    widgets: Array<WidgetType>,
  ): Array<WidgetType> => {
    const updateWidgetSelection = (
      selection: SelectionType
    ) => (widget: WidgetType): WidgetType => {
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
    const mapSelections = (selection: SelectionType) =>
      map(updateWidgetSelection(selection), widgets);
    return chain(mapSelections, selections);
  };

  const differentiateOption = (
    widgets: Array<WidgetType>,
  ): Array<WidgetType> =>
    widgets.map((widget, index) => {
      const diffedOptions = difference(widget.options)(
        filteredWidgets[index].options,
      );
      const disableOptions = map(
        option => ({ ...option, state: 'disabled' }),
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
      leftOption: WidgetOptionType,
      rightOption: WidgetOptionType,
    ): WidgetOptionType =>
      // $FlowFixMe can't figure out why 'concat' complains with the 2nd argument
      key === 'options' ? concat(leftOption, rightOption) : rightOption;

    const mergeWidgetOptions = (
      leftOption: WidgetType,
      rightOption: WidgetType,
    ): WidgetType => mergeDeepWithKey(mergeOptions, leftOption, rightOption);

    const applyMerge = (widget: WidgetType, index: number): WidgetType =>
      mergeWidgetOptions(widget, diffWidgets[index]);
    return widgets.map(applyMerge);
  };
  return pipe(
    differentiateOption,
    mergeWidgetsOptions(filteredWidgets),
    removeWidgetOptionsDuplicates,
    updateWidgetsOptionsState,
  )(widgetsEmpty);
};

export default differentiateWidgets;
