// @flow strict
// @flow-runtime

import { t } from 'translation/utils';
import type { Translation } from 'translation/utils';

type TranslationDicType = {|
  error: string,
  close: string,
  saved: string,
  somethingGoingWrong: string,
  storeNotFound: string,
  storeHasBeenSentToModeration: string,
|};
type TranslationsBundleType = Translation<TranslationDicType>;

const translations: TranslationsBundleType = {
  en: {
    error: 'Error: ',
    close: 'Close.',
    saved: 'Saved!',
    somethingGoingWrong: 'Something going wrong :(',
    storeNotFound: 'Store not found :(',
    storeHasBeenSentToModeration: 'Store has been sent to moderation',
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
