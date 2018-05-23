// @flow

import type { IdType, AttributeValueType } from './index';

export type VariantType = {
  ...IdType,
  photoMain: string | null,
  additionalPhotos: Array<string> | null,
  attributes: Array<AttributeValueType>,
};
