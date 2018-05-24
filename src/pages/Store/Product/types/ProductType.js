// @flow

import type { TranslationType, IdType, VariantType, StoreType } from './index';

export type ProductType = {
  ...IdType,
  name: Array<TranslationType>,
  shortDescription: Array<TranslationType>,
  longDescription: Array<TranslationType>,
  store: StoreType,
  variants: {
    all: Array<VariantType>,
  },
};
