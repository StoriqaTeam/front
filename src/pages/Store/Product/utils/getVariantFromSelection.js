// @flow

import {
  addIndex,
  find,
  flatten,
  head,
  insert,
  isEmpty,
  isNil,
  map,
  pipe,
  propEq,
} from 'ramda';

import { formatPrice } from 'utils';

import type { VariantType, ProductVariantType, SelectionType } from '../types';

const setProductVariantValues = (variant: VariantType) => {
  const defaultImage: string =
    'https://blog.stylingandroid.com/wp-content/themes/lontano-pro/images/no-image-slide.png';
  const mapIndexed = addIndex(map);
  const makePhotos = (images: Array<string>) =>
    mapIndexed(
      (image: string, index: number) => ({
        id: `${index}`,
        image,
      }),
      images,
    );

  const calcCrossedPrice = (price: number, discount: ?number) =>
    isNil(discount) ? 0 : price;

  const calcPrice = (price: number, discount: ?number) =>
    isNil(discount) ? price : formatPrice(price - (price * discount));

  const insertPhotoMain = (
    image: string | null,
    photos: Array<{ id: string, image: string }>,
  ): Array<{ id: string, image: string }> => {
    if (!isNil(image) && photos.every(p => p !== image)) {
      return insert(0, { id: `${photos.length + 1}`, image }, photos);
    }
    return photos;
  };
  const {
    id,
    rawId,
    photoMain,
    additionalPhotos,
    price,
    cashback,
    discount,
    description,
  } = variant;

  return {
    id,
    rawId,
    price: calcPrice(price, discount),
    cashback: isNil(cashback) ? 0 : Math.round(cashback * 100),
    discount: isNil(discount) ? 0 : discount,
    lastPrice: calcCrossedPrice(price, discount),
    photoMain: isNil(photoMain) ? defaultImage : photoMain,
    additionalPhotos: isNil(additionalPhotos)
      ? []
      : insertPhotoMain(photoMain, makePhotos(additionalPhotos)),
    description,
  };
};

const findVariant: (
  Array<VariantType>,
) => string => ProductVariantType = variants => variantId =>
  // $FlowIgnoreMe
  pipe(find(propEq('id')(variantId)), setProductVariantValues)(variants);

const getVariantFromSelection = (selections: Array<SelectionType>) => (
  variants: Array<VariantType>,
): ProductVariantType => {
  if (isEmpty(selections)) {
    // $FlowIgnoreMe
    return setProductVariantValues(head(variants));
  }
  // $FlowIgnoreMe
  return pipe(
    // $FlowIgnoreMe
    map(({ variantIds }) => variantIds),
    flatten,
    map(findVariant(variants)),
    head,
  )(selections);
};

export default getVariantFromSelection;
