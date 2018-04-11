// @flow

import { has, isEmpty } from './index';

/**
 * @desc Extracts 'photoMain' and 'additionalPhotos'
 * @param {[]} array
 * @return {[]}
 */
export default function extractPhotos(array: []): [] {
  // console.log('array', array);
  const photos = array.filter((variant) => {
    return has(variant, 'product');
  }).map(p => p.product);
  return photos.reduce((p) => {
    const additionalPhotos = !isEmpty(p.product.addtionalPhotos) ? p.product.addtionalPhotos : [];
    return {
      photoMain: p.product.photoMain,
      additionalPhotos,
    };
  });
}
