import { forEachObjIndexed, prop, differenceWith } from 'ramda';

/**
 * @desc Compares to set of widgets and marks the differences
 * @param filteredWidgets
 * @param widgets
 */
export default function compareWidgets(filteredWidgets, widgets) {
  const cmp = (x, y) => x.label === y.label;
  const keyValue = (widget, key) => {
    /* eslint-disable no-console */
    // console.log('prop(\'values\', value)', prop('values', filteredWidgets[key]));
    const differences = differenceWith(cmp, prop('values', widget), prop('values', filteredWidgets[key]), );
    const differencesWithOpacity = differences.map(dif => ({ ...dif, opacity: true }));
    console.log('differencesWithOpacity', differencesWithOpacity);
  };
  forEachObjIndexed(keyValue, widgets);
}
