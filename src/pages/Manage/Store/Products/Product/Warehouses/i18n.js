// @flow strict
// @flow-runtime

import { t } from 'translation/utils';
import type { Translation } from 'translation/utils';

type TranslationDicType = {|
  error: string,
  close: string,
  somethingWentWrong: string,
  storages: string,
  noAddress: string,
  save: string,
|};
type TranslationsBundleType = Translation<TranslationDicType>;

const translations: TranslationsBundleType = {
  en: {
    error: 'Error',
    close: 'Close.',
    somethingWentWrong: 'Something going wrong :(',
    storages: 'Storages',
    noAddress: 'No address',
    save: 'Save',
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
