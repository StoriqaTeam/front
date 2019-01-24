// @flow

import type { CryptoCurrencyType, FiatCurrencyType } from 'types';
import type { TranslationType, VariantType, StoreType } from './index';

export type ProductType = {
  id: string,
  rawId: number,
  currency: CryptoCurrencyType | FiatCurrencyType,
  categoryId: number,
  name: Array<TranslationType>,
  shortDescription: Array<TranslationType>,
  longDescription: Array<TranslationType>,
  store: StoreType,
  variants: {
    all: Array<VariantType>,
  },
  rating: number,
};
