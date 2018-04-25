import {
  TranslationType,
  IdType,
  VariantType,
} from './index';

type ProductType = {
  baseProduct: {
    ...IdType,
    name: Array<TranslationType>,
    shortDescription: Array<TranslationType>,
    longDescription:Array<TranslationType>,
    variants: {
      all: Array<VariantType>
    }
  }
}

export default ProductType;
