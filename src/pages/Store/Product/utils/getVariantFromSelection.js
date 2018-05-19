import {map, pipe, flatten, find, propEq, isEmpty, head, addIndex, isNil, insert} from 'ramda';

import { VariantType, ProductVariantType, ThumbnailType } from '../types';

const setProductVariantValues = (variant: VariantType) => {
  const defaultImage: string =
    'https://blog.stylingandroid.com/wp-content/themes/lontano-pro/images/no-image-slide.png';
  const mapIndexed: Function = addIndex(map);
  const makePhotos = (images: Array<string>) =>
    mapIndexed(
      (image: string, index: string) => ({
        id: `${index}`,
        image,
      }),
      images,
    );
  /**
   * @desc Applies the following formula (1 - discount) * price
   */
  const calcCrossedPrice = (discount: string | null, price: string) =>
    isNil(discount)
      ? '0'
      : ((1 - parseInt(discount, 10)) * parseInt(price, 10)).toString();

  const insertPhotoMain = (image: string, photos: Array<{id: string, image: string}>): ThumbnailType => {
    if (!isNil(image)) {
      return insert(0, { id: `${photos.length + 1}`, image, }, photos);
    }
    return photos;
  };
  const { id, photoMain, additionalPhotos, price, cashback, discount } = variant;
  return {
    id,
    price,
    cashback: isNil(cashback) ? '0' : Math.round(cashback * 100),
    discount: isNil(discount) ? '0' : discount,
    crossPrice: calcCrossedPrice(discount, price),
    photoMain: isNil(photoMain) ? defaultImage : photoMain,
    additionalPhotos: isNil(additionalPhotos)
      ? []
      : insertPhotoMain(photoMain, makePhotos(additionalPhotos)),
  };
};

const findVariant: (
  Array<VariantType>
) => string => Array <ProductVariantType> = variants => variantId => {
  const variant = find(propEq('id')(variantId))(variants);
  return setProductVariantValues(variant);
};

const getVariantFromSelection:
  Array<SelectionType> => Array <VariantType> => ProductVariantType = selections => variants => {
  if (isEmpty(selections)) {
    return setProductVariantValues(head(variants));
  }
  return pipe(
    map(({ variantIds }) => variantIds),
    flatten,
    map(findVariant(variants)),
    head,
  )(selections);
};

export default getVariantFromSelection;