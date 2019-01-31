// @flow strict
// @flow-runtime

import { t } from 'translation/utils';
import type { Translation } from 'translation/utils';

type TranslationDicType = {|
  error: string,
  close: string,
  saved: string,
  somethingGoingWrong: string,
  manage: string,
  buttonLabel: string,
  statusModerationCannotBeChanged: string,
|};
type TranslationsBundleType = Translation<TranslationDicType>;

const translations: TranslationsBundleType = {
  en: {
    error: 'Error: ',
    close: 'Close.',
    saved: 'Saved!',
    somethingGoingWrong: 'Something going wrong :(',
    manage: 'Manage',
    buttonLabel: 'Click to upload logo',
    statusModerationCannotBeChanged:
      'Store in status moderation cannot be changed.',
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
