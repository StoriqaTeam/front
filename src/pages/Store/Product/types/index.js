// @flow strict

import * as React from 'react';

import type { AddressFullType, SelectItemType, CurrenciesType } from 'types';

export type TranslationType = {
  lang: string,
  text: string,
};

export type VarianAttributeType = {
  attribute: {
    id: string,
    rawId?: string,
    name: Array<TranslationType>,
    valueType: ?string | ?number,
    metaField: {
      values?: Array<string>,
      translated: Array<TranslationType>,
      uiElement: 'COMBOBOX' | 'RADIOBUTTON' | 'CHECKBOX' | 'COLOR_PICKER',
    },
  },
  value: string,
  metaField: string,
};

export type VariantType = {
  id: string,
  rawId?: number,
  price: number,
  cashback: number | null,
  discount: number | null,
  photoMain: string | null,
  additionalPhotos: Array<string> | null,
  description: string,
  attributes: Array<VarianAttributeType>,
};

export type WidgetOptionType = {
  label: string,
  image: string,
};

export type WidgetType = {
  id: string,
  title: string,
  uiElement: string,
  options: Array<{
    label: string,
    image: ?string,
  }>,
};

export type GroupedWidgetsType = {
  [string]: Array<WidgetType>,
};

export type IdType = {
  id: string,
  rawId?: number,
};

export type StoreType = {
  rawId: number,
  name: Array<TranslationType>,
  rating: number,
  productsCount: string,
  logo: ?string,
  facebookUrl: ?string,
  twitterUrl: ?string,
  instagramUrl: ?string,
};

export type ProductType = {
  id: string,
  rawId: number,
  currency: CurrenciesType,
  name: Array<TranslationType>,
  shortDescription: Array<TranslationType>,
  longDescription: Array<TranslationType>,
  store: StoreType,
  variants: {
    all: Array<VariantType>,
  },
  rating: number,
  categoryId: number,
};

export type ProductVariantType = {
  id: string,
  rawId: number,
  photoMain: ?string,
  additionalPhotos: ?Array<string>,
  price: number,
  cashback: ?number,
  discount: ?number,
  description: string,
  quantity: number,
  preOrder: boolean,
  preOrderDays: number,
  attributes: Array<{
    value: string,
    metaField: ?string,
  }>,
};

export type SelectionType = {
  id: string,
  state: 'selected' | 'available' | 'disabled',
  variantIds: Array<string>,
  value: 'string',
};

export type TabType = {
  id: string,
  label: string,
  content: React.Node | React.Component<{}, {}> | string,
};

export type DeliveryAddress = {
  id: string,
  address: AddressFullType,
  isPriority: boolean,
};

export type PackageType = {
  companyPackageRawId: number,
  currency: string,
  id: string,
  name: string,
  logo: ?string,
  price: number,
  shippingId: number,
};

export type DeliveryDataType = {
  deliveryPackage: ?PackageType,
  country: ?SelectItemType,
  deliveryPackages: Array<PackageType>,
};
