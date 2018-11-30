// @flow strict
// @flow-runtime

import { t } from 'translation/utils';
import type { Translation } from 'translation/utils';

type TranslationDicType = {|
  shop: string,
  items: string,
  reviews: string,
  actions: string,
  about: string,
  storeNotFound: string,
|};
type TranslationsBundleType = Translation<TranslationDicType>;

const translations: TranslationsBundleType = {
  en: {
    shop: 'Shop',
    items: 'Items',
    reviews: 'Reviews',
    actions: 'Actions',
    about: 'About',
    storeNotFound: 'Store Not Found',
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
