// @flow

import type { TranslationType, AttributeMetaFieldType } from './index';

export type AttributeType = {
  id: string,
  rawId?: string,
  name: Array<TranslationType>,
  metaField: AttributeMetaFieldType,
};
