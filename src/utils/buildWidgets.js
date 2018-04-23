// @flow

import { isNil, flatten, uniq, reduce, filter, identity } from 'ramda';
import { extractText } from './index';

/**
 * 1) filter all variants by value
 * 2) take all attribute values from the filtered variant
 *
 * select disable option, it should disable al filtering
 */
type IdType = {
  id?: string,
  rawId?: number,
}

type TranslationType = {
  lang: string,
  text: string,
}

type UIType = 'COMBOBOX' | 'RADIOBUTTON' | 'CHECKBOX' | 'COLOR_PICKER'

type TranslatedValueType = {
  translations: TranslationType[],
}

type AttributeMetaFieldType = {
  values?: string[],
  translatedValues?: TranslatedValueType[],
  uiElement: UIType,
}

type ProductType = {
  ...IdType,
  isActive?: boolean,
  discount?: number,
  photoMain?: string,
  additionalPhotos?: string[],
  vendorCode?: string,
  cashBack?: number,
  price?: number,
}

type Attribute = {
  ...IdType,
  name: TranslationType[],
  valueType?: string | number,
  metaField: AttributeMetaFieldType,
}

type AttributeValueType = {
  attribute: Attribute,
  value?: string,
  metaField?: string,
}

type VariantType = {
  rawId: number,
  product: ProductType,
  attributes: AttributeValueType[]
}

type WidgetValueType = {
  id: string,
  label: string,
  img?: string,
}

/**
 * @desc Groups an array of objects by certain property
 * @param {{}[]} array - Array of objects
 * @param {string} prop - The property which by want to group
 * @param {string} [type] = 'object' - type of object to return could be and object or array
 * @return {{prop: []}}
 */
function group(array: [], prop: string, type: string = 'object'): {} {
  return array.reduce((accumulator, current) => {
    // copy accumulator to avoid 'parameter reassignment'
    const item = Object.assign({}, accumulator);
    if (type === 'object') {
      item[current[prop]] = item[current[prop]] || {};
      item[current[prop]] = current;
      return item;
    }
    item[current[prop]] = item[current[prop]] || [];
    item[current[prop]].push(current);
    return item;
  }, {});
}

/**
 * @param {string} image
 * @return {string}
 */
function setImage(image: string): string {
  const defaultImage = 'https://blog.stylingandroid.com/wp-content/themes/lontano-pro/images/no-image-slide.png';
  return !isNil(image) && image.includes('http') ? image : defaultImage;
}

/**
 * @param {any[]} array
 * @param {[]} images
 * @return {WidgetValueType[]}
 */
function buildWidgetInterface(array: any[], images: []): WidgetValueType[] {
  return array.map((value, index) => ({
    id: `${index}`,
    label: value,
    img: images[index].img,
    opacity: false,
  }));
}

/**
 * @param {VariantType[]} variants
 * @return {any[]}
 */
function transformVariants(variants: VariantType[]): any[] {
  const results = variants.map((variant) => {
    const {
      id: variantId,
      attributes,
    } = variant;
    return attributes.map(({
      value,
      metaField,
      attribute: {
        id,
        name,
        metaField: {
          uiElement,
        },
      },
    }: AttributeValueType) => ({
      id,
      variantId,
      value,
      title: extractText(name),
      image: setImage(metaField),
      uiElement,
    }));
  });
  return flatten(results);
}

function reduceGroup(widgetGroup) {
  return reduce((accumulator, item) => {
    // copy accumulator to avoid 'parameter-reassign'
    const copy = { ...accumulator };
    const values = filter(identity, [].concat(copy.values, item.value));
    const valuesWithImages =
      filter(identity, [].concat(copy.valuesWithImages, { label: item.value, img: item.image }));
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
  }, {}, widgetGroup);
}

export default function buildWidgets(variants: VariantType[]) {
  const transformedVariants = transformVariants(variants);
  // group by 'uiElement' property
  const grouped = group(transformedVariants, 'uiElement', 'array');
  const result = Object.keys(grouped).reduce((acc, key) => {
    const reduced = reduceGroup(grouped[key]);
    acc[key] = {
      ...reduced,
      values: buildWidgetInterface(uniq(reduced.values), reduced.valuesWithImages),
    };
    return acc;
  }, {});
  return result;
}
