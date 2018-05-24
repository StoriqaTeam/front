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

import type {
  VariantType,
  ProductVariantType,
  WidgetOptionType,
} from '../types';

const setProductVariantValues = (variant: VariantType) => {
  const defaultImage: string =
    'https://blog.stylingandroid.com/wp-content/themes/lontano-pro/images/no-image-slide.png';
  const mapIndexed: Function = addIndex(map);
  const makePhotos = (images: Array<string>) =>
    mapIndexed(
      (img: string, index: string) => ({
        id: `${index}`,
        img,
      }),
      images,
    );
  /**
   * @desc Applies the following formula (1 - discount) * price
   */
  const calcCrossedPrice = (discount: string | null, price: string) =>
    isNil(discount) ? 0 : (1 - parseInt(discount, 10)) * parseInt(price, 10);

  const insertPhotoMain = (
    img: string,
    photos: Array<{ id: string, img: string }>,
  ): Array<{ id: string, image: string }> => {
    if (!isNil(img) && photos.every(p => p !== img)) {
      // $FlowIgnore
      return insert(0, { id: `${photos.length + 1}`, img }, photos);
    }
    // $FlowIgnore
    return photos;
  };
  const {
    id,
    photoMain,
    additionalPhotos,
    // $FlowIgnoreMe
    price,
    // $FlowIgnoreMe
    cashback,
    // $FlowIgnoreMe
    discount,
  } = variant;
  return {
    id,
    price,
    cashback: isNil(cashback) ? 0 : Math.round(cashback * 100),
    discount: isNil(discount) ? 0 : discount,
    crossPrice: calcCrossedPrice(discount, price),
    photoMain: isNil(photoMain) ? defaultImage : photoMain,
    additionalPhotos: isNil(additionalPhotos)
      ? []
      : // $FlowIgnoreMe
        insertPhotoMain(photoMain, makePhotos(additionalPhotos)),
  };
};

const findVariant: (
  Array<VariantType>,
) => string => ProductVariantType = variants => variantId =>
  // $FlowIgnoreMe
  pipe(find(propEq('id')(variantId)), setProductVariantValues)(variants);

const getVariantFromSelection: (
  Array<WidgetOptionType>,
  // $FlowIgnoreMe
) => (Array<VariantType>) => ProductVariantType = selections => variants => {
  if (isEmpty(selections)) {
    // $FlowIgnoreMe
    return setProductVariantValues(head(variants));
  }
  return pipe(
    // $FlowIgnoreMe
    map(({ variantIds }) => variantIds),
    flatten,
    map(findVariant(variants)),
    head,
  )(selections);
};

export default getVariantFromSelection;
