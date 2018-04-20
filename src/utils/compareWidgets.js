import { forEachObjIndexed } from 'ramda';

/**
 * @desc Compares to set of widgets and marks the differences
 * @param filteredWidgets
 * @param widgets
 */
export default function compareWidgets(filteredWidgets, widgets) {
  /* eslint-disable no-console */
  // console.log('filteredWidgets', filteredWidgets);
  // console.log('widgets', widgets);
  const keyValue = (key, value) => console.log(key);
  forEachObjIndexed(keyValue, widgets);
}
