// @flow

export type ProductVariantType = {
  id: string,
  rawId: number,
  photoMain: ?string,
  additionalPhotos: ?Array<string>,
  price: number,
  cashback: ?number,
  discount: ?number,
  lastPrice: ?number,
  description: string,
};
