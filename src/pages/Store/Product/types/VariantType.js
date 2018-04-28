import { IdType, AttributeValueType } from './index';

type VariantType = {
  ...IdType,
  photoMain: string | null,
  additionalPhotos: Array<string> | null,
  attributes: Array<AttributeValueType>,
};

export default VariantType;
