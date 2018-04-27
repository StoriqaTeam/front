import { IdType, TranslationType, AttributeMetaFieldType } from './index';

type AttributeType = {
  ...IdType,
  name: Array<TranslationType>,
  metaField: AttributeMetaFieldType,
};

export default AttributeType;
