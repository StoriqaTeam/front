// @flow

import { isNil, isEmpty, flatten, uniq } from 'ramda';
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

function filterValues(variants) {
  const results = variants.map((variant) => {
    const { attributes } = variant;
    return attributes.map(({
      value,
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
      uiElement,
    }));
  });
  const grouped = group(flatten(results), 'id', 'array');
  const filtered = {};
  Object.keys(grouped).forEach(key => filtered[key] = uniq(grouped[key]));
  //
  const result = Object.keys(filtered).reduce((acc, key) => {
    const reduced = filtered[key].reduce((accumulator, current) => {
      // console.log(current)
      const copy = Object.assign({}, accumulator);
      copy.uiElement = current.uiElement;
      copy.values = [].concat(accumulator.values, current.value).filter(i => i !== undefined);
      return copy;
    }, {});
    acc[key] = {
      values: 'asasas',
      ...reduced,
    };
    return acc;
  }, {});
  /* eslint-disable no-console */
  console.log('result', result);
}
/**
 * @param {VariantType[]} variants
 * @return {{}[]}
 */
export default function buildWidgets(variants: VariantType[]) {
  // remove empty attributes
  const filtered = variants.filter(v => !isEmpty(v.attributes));
  //
  filterValues(filtered);
  return filtered.reduce((current, variant) => {
    // copy current to avoid 'parameter reassignment'
    const copy = [...current];
    const { attributes, id: variantId } = variant;
    /* eslint-disable no-console */
    // console.log('buildAttribute(attributes)', buildAttribute(attributes));
    return [
      ...copy,
      {
        variantId,
        ...group(buildAttribute(attributes), 'uiElement'),
      },
    ];
  }, []);
}
