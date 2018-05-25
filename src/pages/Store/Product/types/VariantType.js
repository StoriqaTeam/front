// @flow

import type { AttributeValueType } from './index';

export type VariantType = {
  id: string,
  rawId?: number,
  price: number,
  cashback: number | null,
  discount: number | null,
  photoMain: string | null,
  additionalPhotos: Array<string> | null,
  description: string,
  attributes: Array<AttributeValueType>,
};
