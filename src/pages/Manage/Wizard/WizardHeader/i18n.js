// @flow strict
// @flow-runtime

import { t } from 'translation/utils';
import type { Translation } from 'translation/utils';

type TranslationDicType = {|
  nameYourStore: string,
  setUpStore: string,
  fillYourStoreWithGoods: string,
  addYourCard: string,
|};
type TranslationsBundleType = Translation<TranslationDicType>;

const translations: TranslationsBundleType = {
  en: {
    nameYourStore: 'Name your store',
    setUpStore: 'Set up store',
    fillYourStoreWithGoods: 'fill your store with goods',
    addYourCard: 'Add your card',
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
