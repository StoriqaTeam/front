// @flow

import { flatten, isNil } from 'ramda';
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

type WidgetType = {
  id: string,
  metaField: string,
  title: string,
  translatedValues: string[],
  uiElement: string,
  value: string | number,
}

/**
 * @desc Groups an array of objects by certain property
 * @param {{}[]} array - Array of objects
 * @param {string} prop - The property which by want to group
 * @return {{prop: []}}
 */
function group(array: [], prop: string): {} {
  return array.reduce((accumulator, current) => {
    // clone accumulator to avoid 'parameter reassignment'
    const item = Object.assign({}, accumulator);
    item[current[prop]] = item[current[prop]] || [];
    item[current[prop]].push(current);
    return item;
  }, Object.create(null));
}

/**
 * @desc Iterates over a translatedValues array and just returns their corresponding translation
 * @param {TranslatedValueType[]} translatedValues
 * @param {string} [lang] = 'EN'
 * @return {string[]}
 */
function translateValues(translatedValues: TranslatedValueType[], lang: string = 'EN'): string[] {
  return translatedValues.map(({ translations }) => extractText(translations, lang));
}

const defaultImage = 'https://blog.stylingandroid.com/wp-content/themes/lontano-pro/images/no-image-slide.png';

/**
 * @param {VariantType[]} variants
 * @return {WidgetType[]}
 */
export default function buildWidgets(variants: VariantType[]): WidgetType[] {
  const results = variants.map((variant) => {
    const { attributes } = variant;
    return attributes.map((attr: AttributeValueType) => {
      const {
        value,
        metaField,
        attribute: {
          id,
          name,
          metaField: {
            translatedValues,
            uiElement,
          },
        },
      } = attr;
      return {
        id,
        value,
        metaField: isNil(metaField) ? defaultImage : metaField,
        title: extractText(name),
        translatedValues: translateValues(translatedValues),
        uiElement,
      };
    });
  });
  return group(flatten(results), 'title');
}
