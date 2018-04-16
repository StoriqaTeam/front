// @flow

import { isNil } from 'ramda';
import { extractText } from './index';

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

type WidgetType = {
  id: string,
  image: string,
  title: string,
  values: WidgetValueType[],
  uiElement: string,
  value: string | number,
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
    // clone accumulator to avoid 'parameter reassignment'
    const item = Object.assign({}, accumulator);
    if (type === 'object') {
      item[current[prop]] = item[current[prop]] || {};
      item[current[prop]] = current;
      return item;
    }
    item[current[prop]] = item[current[prop]] || [];
    item[current[prop]].push(current);
    return item;
  }, Object.create(null));
}

/**
 * @param {string} image
 * @return {string}
 */
function setImage(image: string): string {
  const defaultImage = 'https://blog.stylingandroid.com/wp-content/themes/lontano-pro/images/no-image-slide.png';
  return isNil(image) ? defaultImage : image;
}

/**
 * @desc Iterates over a translatedValues array and just returns their corresponding translation
 * @param {TranslatedValueType[]} translatedValues
 * @param {string} [lang] = 'EN'
 * @param {string} image
 * @param {string} uiElement
 * @return {WidgetValueType[]}
 */
function translateValues(
  translatedValues: TranslatedValueType[],
  lang: string = 'EN',
  image: string,
  uiElement: string,
): WidgetValueType[] {
  const img = setImage(image);
  return translatedValues.map(({ translations }, index) => ({
    id: `${index}`,
    label: extractText(translations, lang),
    img,
    uiElement,
  }));
}

/**
 * @param {any[]} array
 * @param {string} uiElement
 * @return {WidgetValueType[]}
 */
function buildWidgetInterface(array: any[], uiElement: string): WidgetValueType[] {
  return array.map((value, index) => ({
    id: `${index}`,
    label: value,
    uiElement,
  }));
}

/**
 * @param {AttributeMetaFieldType} metaField
 * @param {string} image
 * @return {{values: WidgetValueType[], uiElement: AttributeMetaFieldType.uiElement}}
 */
function buildWidgetValues(
  metaField: AttributeMetaFieldType,
  image: string,
): {value: WidgetValueType[], uiElement: string} {
  const {
    values,
    translatedValues,
    uiElement,
  } = metaField;
  if (isNil(values)) {
    return {
      values: translateValues(translatedValues, 'EN', image, uiElement),
      uiElement,
    };
  }
  return {
    values: buildWidgetInterface(values, uiElement),
    uiElement,
  };
}

/**
 * @param {AttributeValueType[]} attributes
 * @return {WidgetType[]}
 */
function buildAttribute(attributes: AttributeValueType[]): WidgetType[] {
  return attributes.map((attr: AttributeValueType) => {
    const {
      value,
      metaField,
      attribute,
    } = attr;
    return {
      id: attribute.id,
      value,
      image: setImage(metaField),
      title: extractText(attribute.name),
      ...buildWidgetValues(attribute.metaField),
    };
  });
}

/**
 * @param {VariantType[]} variants
 * @return {{}[]}
 */
export default function buildWidgets(variants: VariantType[]) {
  return variants.reduce((current, variant) => {
    const copy = [...current];
    const { attributes, id: variantId } = variant;
    return [
      ...copy,
      {
        variantId,
        ...group(buildAttribute(attributes), 'uiElement'),
      },
    ];
  }, []);
}
