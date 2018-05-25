// @flow

export type ProductVariantType = {
  id: string,
  rawId: number,
  photoMain: null | string,
  additionalPhotos: null | Array<string>,
  price: number,
  cashback: null | number,
  discount: null | number,
  crossPrice: null | number,
  description: string,
};
