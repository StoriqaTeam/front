// @flow strict
// @flow-runtime

import { t } from 'translation/utils';
import type { Translation } from 'translation/utils';

type TranslationDicType = {|
  buyNow: string,
  preOrder: string,
  addToCart: string,
  viewCart: string,
  youMustSelectAnAttribute: string,
|};
type TranslationsBundleType = Translation<TranslationDicType>;

const translations: TranslationsBundleType = {
  en: {
    buyNow: 'Buy now',
    preOrder: 'Pre-order',
    addToCart: 'Add to cart',
    viewCart: 'View cart',
    youMustSelectAnAttribute: 'You must select an attribute(s): ',
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
