// @flow

import type { AttributeValueType } from './index';

export type VariantType = {
  id: string,
  rawId?: number,
  photoMain: string | null,
  additionalPhotos: Array<string> | null,
  attributes: Array<AttributeValueType>,
};
