import {
  forEachObjIndexed,
  prop,
  differenceWith,
  findIndex,
  propEq,
} from 'ramda';

/**
 * @desc Compares to set of widgets and marks the differences
 * @param filteredWidgets
 * @param widgets
 */
export default function compareWidgets(filteredWidgets, widgets) {
  const widgetClone = {};
  /**
   * @param x
   * @param y
   * @return {boolean}
   */
  const compareValue = (x, y) => x.label === y.label;
  /**
   * @param {{}} widget
   * @param {string} key
   * @return {*}
   */
  const keyValue = (widget: {}, key: string) => {
    //
    const { variantId } = filteredWidgets[key];
    // get current widgets's attributes and reset back to false
    const widgetAttributes = prop('values', widget).map(val => ({
      ...val,
      opacity: false,
    })); // (HORRIBLE hack :(, please Дьжэро, you can make it better)
    // get the widget's filtered attributes
    const filterWidgetAttributes = prop('values', filteredWidgets[key]);
    // extract just the attributes that doesn't exist in 'filterWidgetAttributes'
    const differences = differenceWith(
      compareValue,
      widgetAttributes,
      filterWidgetAttributes,
    );
    // apply each different attribute an 'opacity' property
    const differencesWithOpacity = differences.map(dif => ({
      ...dif,
      opacity: true,
    }));
    // iterate each attribute to add the attribute that doesn't has the 'opacity' attribute
    const result = widgetAttributes.map(widgetAttr => {
      // get the index of the label property in 'differencesWithOpacity'
      const index = findIndex(propEq('label', widgetAttr.label))(
        differencesWithOpacity,
      );
      // if doesn't exists, return the attribute with opacity
      if (index !== -1) {
        return differencesWithOpacity[index];
      }
      // otherwise return the current widget attribute
      return widgetAttr;
    });
    // build the new widget
    widgetClone[key] = {
      ...widget,
      values: result,
      variantId, // override with current filteredWidgets
    };
  };
  forEachObjIndexed(keyValue, widgets);
  /* eslint-disable no-console */
  // console.log('widgetClone', widgetClone);
  return widgetClone;
}
