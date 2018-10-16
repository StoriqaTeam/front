// @flow strict
// @flow-runtime

import { t } from 'translation/utils';
import type { Translation } from 'translation/utils';

type TranslationDicType = {|
  cookiePolicy: string,
  searchCategory_products: string,
  searchCategory_shops: string,
|};

type TranslationsBundleType = Translation<TranslationDicType>;

const translations: TranslationsBundleType = {
  en: {
    cookiePolicy: 'This website uses ‘cookies’ to give you best, most relevant experience. Using this website means you’re Ok with this. If you do not use cookies, you will not be able to access the website.',
    searchCategory_products: 'Products',
    searchCategory_shops: 'Shops',
  }
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