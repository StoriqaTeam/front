// @flow

import { IdType, TranslationType, AttributeMetaFieldType } from './index';

export type AttributeType = {
  ...IdType,
  name: Array<TranslationType>,
  metaField: AttributeMetaFieldType,
};
