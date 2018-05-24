// @flow

import type { WidgetType } from './index';

export type ProductVariantType = {
  id: string,
  photoMain: null | string,
  additionalPhotos: null | Array<string>,
  price: number,
  cashback: null | number,
  discount: null | number,
  crossPrice: string,
  description: string,
  variants: Array<WidgetType>,
};
