// @flow strict
// @flow-runtime

import { t } from 'translation/utils';
import type { Translation } from 'translation/utils';

type TranslationDicType = {|
  goods: string,
  userReviews: string,
  contactSeller: string,
  toFavorites: string,
  noStore: string,
  items: string,
|};
type TranslationsBundleType = Translation<TranslationDicType>;

const translations: TranslationsBundleType = {
  en: {
    goods: 'goods',
    userReviews: 'user reviews',
    contactSeller: 'Contact seller',
    toFavorites: 'To Favorites',
    noStore: 'No Store',
    items: 'Items',
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
