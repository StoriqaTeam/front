import { WidgetType } from './index';

type ProductVariantType = {
  id: string,
  photoMain: null | string,
  additionalPhotos: null | Array<string>,
  price: number,
  cashback: null | number,
  discount: null | number,
  crossPrice: string,
  variants: Array<WidgetType>,
};

export default ProductVariantType;
