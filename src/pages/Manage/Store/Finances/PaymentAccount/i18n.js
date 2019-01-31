// @flow strict
// @flow-runtime

import { t } from 'translation/utils';
import type { Translation } from 'translation/utils';

type TranslationDicType = {|
  international: string,
  russian: string,
  save: string,
  cancel: string,
  edit: string,
  error: string,
  close: string,
  somethingGoingWrong: string,
|};
type TranslationsBundleType = Translation<TranslationDicType>;

const translations: TranslationsBundleType = {
  en: {
    international: 'International',
    russian: 'Russian',
    save: 'Save',
    cancel: 'Cancel',
    edit: 'Edit',
    error: 'Error: ',
    close: 'Close.',
    somethingGoingWrong: 'Something going wrong :(',
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
