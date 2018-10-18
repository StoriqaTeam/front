// @flow strict
// @flow-runtime

import { t } from 'translation/utils';
import type { Translation } from 'translation/utils';

type TranslationDicType = {|
  labelNewPassword: string,
  labelRepeatPassword: string,
  submitNewPassword: string,
  errorNotMatch: string,
|};

type TranslationsBundleType = Translation<TranslationDicType>;

const translations: TranslationsBundleType = {
  en: {
    labelNewPassword: 'New Password',
    labelRepeatPassword: 'New Password Again',
    submitNewPassword: 'Submit New Password',
    errorNotMatch: 'Not Match',
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