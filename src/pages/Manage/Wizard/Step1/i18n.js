// @flow strict
// @flow-runtime

import { t } from 'translation/utils';
import type { Translation } from 'translation/utils';

type TranslationDicType = {|
  giveYourStoreAname: string,
  makeAbrightName: string,
  storeName: string,
  shortDescription: string,
|};
type TranslationsBundleType = Translation<TranslationDicType>;

const translations: TranslationsBundleType = {
  en: {
    giveYourStoreAname: 'Give your store a name',
    makeAbrightName:
      'Make a bright name for your store to attend your customers and increase your sales',
    storeName: 'Store name',
    shortDescription: 'Short Description',
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
