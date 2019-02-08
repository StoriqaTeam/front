// @flow strict
// @flow-runtime

import { t } from 'translation/utils';
import type { Translation } from 'translation/utils';

type TranslationDicType = {|
  myOrders: string,
  profileSettings: string,
  myShop: string,
  startSelling: string,
  logout: string,
|};
type TranslationsBundleType = Translation<TranslationDicType>;

const translations: TranslationsBundleType = {
  en: {
    myOrders: 'My orders',
    profileSettings: 'Profile Settings',
    myShop: 'My Shop',
    startSelling: 'Start Selling',
    logout: 'Logout',
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
