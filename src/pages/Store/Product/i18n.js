// @flow strict
// @flow-runtime

import { t } from 'translation/utils';
import type { Translation } from 'translation/utils';

type TranslationDicType = {|
  productAddedToCart: string,
  unableToAddProductToCart: string,
  close: string,
  productNotFound: string,
  storeNotFound: string,
  noDescription: string,
  noLongDescription: string,
|};
type TranslationsBundleType = Translation<TranslationDicType>;

const translations: TranslationsBundleType = {
  en: {
    productAddedToCart: 'Product added to cart!',
    unableToAddProductToCart: 'Unable to add product to cart',
    close: 'Close.',
    productNotFound: 'Product Not Found',
    storeNotFound: 'Store Not Found',
    noDescription: 'No Description',
    noLongDescription: 'No Long Description',
  },
};

const validate = (json: {}, verbose: boolean = false): boolean => {
  try {
    (json: TranslationsBundleType); // eslint-disable-line
    return true;
  } catch (err) {
    verbose && console.error(err); // eslint-disable-line
    return false;
  }
};

export { translations, validate };
export default t(translations);
