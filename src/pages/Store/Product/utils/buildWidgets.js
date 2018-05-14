// @flow

import { chain, filter, identity, isNil, keys, reduce, uniq } from 'ramda';

import { extractText } from 'utils';

import { VariantType } from '../types';

type WidgetValueType = {
  id: string,
  label: string,
  img?: string,
};

type TransformedVariantType = {
  id: string,
  image: string,
  title: string,
  uiElement: string,
  value: string,
  variantId: string,
};

/**
 * @desc Groups an array of objects by certain property
 * @param {{}[]} array - Array of objects
 * @param {string} property - The property which by want to group
 * @return {{prop: []}}
 */
function group(array: Array<TransformedVariantType>, property: string): {} {
  return array.reduce((accumulator, current) => {
    // copy accumulator to avoid 'parameter reassignment'
    const item = Object.assign({}, accumulator);
    item[current[property]] = item[current[property]] || [];
    item[current[property]].push(current);
    return item;
  }, {});
}

/**
 * @param {string} image
 * @return {string}
 */
const setImage = (image: string): string => {
  const defaultImage =
    'https://blog.stylingandroid.com/wp-content/themes/lontano-pro/images/no-image-slide.png';
  return !isNil(image) && image.includes('http') ? image : defaultImage;
};

/**
 * @param {any[]} array
 * @param {[]} images
 * @return {Array<WidgetValueType>}
 */
function buildWidgetInterface(
  array: any[],
  images: [],
): Array<WidgetValueType> {
  return array.map((value, index) => ({
    id: `${index}`,
    label: value,
    img: images[index].img,
    opacity: false,
  }));
}

function extractVariantAttributes(
  variant: VariantType,
): Array<TransformedVariantType> {
  const { id: variantId, attributes } = variant;
  return attributes.map(
    ({
      value,
      metaField,
      attribute: {
        id,
        name,
        metaField: { uiElement },
      },
    }) => ({
      id,
      variantId,
      value,
      title: extractText(name),
      image: setImage(metaField),
      uiElement,
    }),
  );
}

/**
 * @param {Array<VariantType>} variants
 * @return {Array<TransformedVariantType>}
 */

/*
 * @return {Function(Array<VariantType>)}
 */
export const transformVariants: (
  Array<VariantType>,
) => Array<TransformedVariantType> = chain(extractVariantAttributes);

function reduceGroup(widgetGroup) {
  return reduce(
    (accumulator, item) => {
      // copy accumulator to avoid 'parameter-reassign'
      const copy = { ...accumulator };
      const values = filter(identity, [].concat(copy.values, item.value));
      const valuesWithImages = filter(
        identity,
        [].concat(copy.valuesWithImages, {
          label: item.value,
          img: item.image,
        }),
      );
      copy.uiElement = item.uiElement;
      copy.values = values;
      const { title, variantId } = item;
      const outputItem = {
        variantId,
        ...copy,
        title,
        values,
        valuesWithImages,
      };
      return outputItem;
    },
    {},
    widgetGroup,
  );
}

export default function buildWidgets(variants: Array<VariantType>) {
  const transformedVariants = transformVariants(variants);
  // group by 'uiElement' property
  const grouped = group(transformedVariants, 'uiElement');
  const result = keys(grouped).reduce((acc, key) => {
    const reduced = reduceGroup(grouped[key]);
    acc[key] = {
      ...reduced,
      values: buildWidgetInterface(
        uniq(reduced.values),
        reduced.valuesWithImages,
      ),
    };
    return acc;
  }, {});
  return result;
}
