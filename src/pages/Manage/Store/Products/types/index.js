// @flow strict

import type { AddressFullType, ModerationStatusType } from 'types';

export type FormErrorsType = {
  [string]: Array<string>,
};

export type AttributeValueType = {
  attrId: number,
  value: string,
  metaField?: ?string,
};

export type MetricsType = {
  lengthCm: number,
  widthCm: number,
  heightCm: number,
  weightG: number,
};

export type FormType = {
  name: string,
  seoTitle: string,
  seoDescription: string,
  shortDescription: string,
  longDescription: string,
  categoryId: ?number,

  idMainVariant: ?string,
  rawIdMainVariant: ?number,
  photoMain: ?string,
  photos: ?Array<string>,
  vendorCode: string,
  price: number,
  cashback: ?number,
  discount: ?number,
  quantity?: ?number,
  preOrderDays: string,
  preOrder: boolean,
  attributeValues: Array<AttributeValueType>,
  metrics: MetricsType,
};

export type VariantType = {
  idMainVariant: ?string,
  rawIdMainVariant: ?number,
  vendorCode: string,
  price: ?number,
  cashback: ?number,
  discount: ?number,
  photoMain: ?string,
  photos: ?Array<string>,
  attributeValues: Array<AttributeValueType>,
  preOrder: boolean,
  preOrderDays: string,
};

export type LangTextType = Array<{
  lang: string,
  text: string,
}>;

export type CustomAttributeType = {
  attribute: {
    id: string,
    rawId: number,
  },
  attributeId: number,
  id: string,
  rawId: number,
};

export type GetAttributeType = {
  id: string,
  rawId: number,
  metaField: {
    translatedValues: Array<{
      translations: Array<{
        lang: string,
        text: string,
      }>,
    }>,
    uiElement: 'COMBOBOX' | 'RADIOBUTTON' | 'CHECKBOX' | 'COLOR_PICKER',
    values: ?Array<string>,
  },
  name: LangTextType,
  valueType: 'STR' | 'FLOAT',
};

export type ProductType = {
  id: string,
  rawId: number,
  additionalPhotos: Array<string>,
  attributes: Array<{
    attribute: GetAttributeType,
    attrId: number,
    metaField: string,
    value: string,
  }>,
  cashback: number,
  discount: number,
  photoMain: string,
  preOrder: boolean,
  preOrderDays: number,
  price: number,
  stocks: Array<{
    id: string,
    productId: number,
    quantity: number,
    warehouse: {
      addressFull: AddressFullType,
    },
    warehouseId: string,
  }>,
  vendorCode: string,
};

export type ProductCategoryType = {
  id: string,
  rawId: number,
  getAttributes: Array<GetAttributeType>,
};

export type BaseProductType = {
  id: string,
  rawId: number,
  category: ProductCategoryType,
  currency: string,
  customAttributes: Array<CustomAttributeType>,
  longDescription: LangTextType,
  name: LangTextType,
  products: {
    edges: Array<{
      node: ProductType,
    }>,
  },
  seoDescription: LangTextType,
  seoTitle: LangTextType,
  shortDescription: LangTextType,
  status: ModerationStatusType,
  store: {
    id: string,
    rawId: number,
    logo: string,
    name: LangTextType,
    warehouses: Array<{
      addressFull: {
        countryCode: string,
      },
    }>,
  },
  lengthCm: ?number,
  widthCm: ?number,
  heightCm: ?number,
  weightG: ?number,
};

export type ValueForAttributeInputType = {
  attr: GetAttributeType,
  variant: ?ProductType,
};
