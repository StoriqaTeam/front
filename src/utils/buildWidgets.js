// @flow

import { isNil, flatten, uniq } from 'ramda';
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
  }, Object.create(null));
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
 * @param {string} image
 * @return {WidgetValueType[]}
 */
function buildWidgetInterface(array: any[], image: string): WidgetValueType[] {
  return array.map((value, index) => ({
    id: `${index}`,
    label: value,
    image,
  }));
}

/**
 * @param {AttributeMetaFieldType} metaField
 * @param {string} image
 * @param {string} attributeId
 * @return {{values: WidgetValueType[], uiElement: AttributeMetaFieldType.uiElement}}
 */
function buildWidgetValues(
  metaField: AttributeMetaFieldType,
  image: string,
  attributeId: string,
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
      id: attributeId,
    };
  }
  return {
    values: buildWidgetInterface(values, uiElement),
    uiElement,
    id: attributeId,
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
      ...buildWidgetValues(attribute.metaField, setImage(metaField), attribute.id),
    };
  });
}

/**
 * @param {VariantType[]} variants
 * @return {any[]}
 */
function transformVariants(variants: VariantType[]): any[] {
  const results = variants.map((variant) => {
    const { attributes } = variant;
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
      value,
      title: extractText(name),
      image: setImage(metaField),
      uiElement,
    }));
  });
  return flatten(results);
}

export default function buildWidgets(variants: VariantType[]) {
  const transformedVariants = transformVariants(variants);
  // group by 'uiElement' property
  const grouped = group(transformedVariants, 'uiElement', 'array');
  // reduce to a single Widget object
  const result = Object.keys(grouped).reduce((acc, key) => {
    const reduced = grouped[key].reduce((accumulator, current) => {
      // copy accumulator to avoid 'parameter-reassign'
      const copy = { ...accumulator };
      const values = [].concat(copy.values, current.value).filter(i => i !== undefined);
      copy.uiElement = current.uiElement;
      copy.values = values;
      const { title, image } = current;
      return {
        ...copy,
        title,
        image,
      };
    }, {});
    acc[key] = {
      ...reduced,
      values: buildWidgetInterface(uniq(reduced.values), reduced.image),
    };
    return acc;
  }, {});
  /* eslint-disable no-console */
  console.log('result', result);
  return result;
}
