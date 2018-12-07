// @flow strict
// @flow-runtime

import { t } from 'translation/utils';
import type { Translation } from 'translation/utils';

type TranslationDicType = {|
  error: string,
  close: string,
  saved: string,
  save: string,
  labelEmail: string,
  labelPhone: string,
  somethingGoingWrong: string,
  storeIsOnModeration: string,
  storeIsBlocked: string,
|};
type TranslationsBundleType = Translation<TranslationDicType>;

const translations: TranslationsBundleType = {
  en: {
    error: 'Error: ',
    close: 'Close.',
    saved: 'Saved!',
    save: 'Save',
    labelEmail: 'Email',
    labelPhone: 'Phone',
    somethingGoingWrong: 'Something going wrong :(',
    storeIsOnModeration: 'Store is on moderation',
    storeIsBlocked: 'Store is blocked, contact the support service',
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
