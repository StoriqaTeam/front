// @flow

import type { TranslationType } from './index';

export type StoreType = {
  rawId: number,
  name: Array<TranslationType>,
  rating: number,
  productsCount: string,
  logo: ?string,
};
