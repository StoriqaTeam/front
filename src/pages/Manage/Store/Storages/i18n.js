// @flow strict
// @flow-runtime

import { t } from 'translation/utils';
import type { Translation } from 'translation/utils';

type TranslationDicType = {|
  error: string,
  close: string,
  somethingGoingWrong: string,
  storageDeleted: string,
  itemList: string,
  addStorage: string,
  noStorages: string,
|};
type TranslationsBundleType = Translation<TranslationDicType>;

const translations: TranslationsBundleType = {
  en: {
    error: 'Error: ',
    close: 'Close.',
    somethingGoingWrong: 'Something going wrong :(',
    storageDeleted: 'Storage delete!',
    itemList: 'Items list',
    addStorage: 'Add storage',
    noStorages: 'No storages',
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
