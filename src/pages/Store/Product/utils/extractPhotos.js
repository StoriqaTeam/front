// @flow

import { map, addIndex, isNil } from 'ramda';

type VariantPhotosType = {
  id: string,
  photoMain: string,
  additionalPhotos: Array<{ id: string, img: string }>,
};

/**
 * @desc Extracts 'photoMain' and 'additionalPhotos'
 * @param {[]} array
 * @return {[]}
 */
export default function extractPhotos(array: []): Array<VariantPhotosType> {
  const defaultImage: string =
    'https://blog.stylingandroid.com/wp-content/themes/lontano-pro/images/no-image-slide.png';
  /**
   * @return {Function}
   */
  const mapIndexed: Function = addIndex(map);
  /**
   * @desc Takes Array<string> and return 'thumbnail-able' object
   * @param {Array<string>} images
   * @return {Array<{id: string, img: string}>}
   */
  const makePhotos = (images: Array<string>) =>
    mapIndexed(
      (image: string, index: string) => ({
        id: `${index}`,
        image,
      }),
      images,
    );
  return array.map(({ id, photoMain, additionalPhotos }) => ({
    id,
    photoMain: isNil(photoMain) ? defaultImage : photoMain,
    additionalPhotos: isNil(additionalPhotos)
      ? []
      : makePhotos(additionalPhotos),
  }));
}
