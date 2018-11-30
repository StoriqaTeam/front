// @flow strict
// @flow-runtime

import { t } from 'translation/utils';
import type { Translation } from 'translation/utils';

type TranslationDicType = {|
  labelFirstName: string,
  labelLastName: string,
  labelEmail: string,
  labelPassword: string,
  signUp: string,
|};

type TranslationsBundleType = Translation<TranslationDicType>;

const translations: TranslationsBundleType = {
  en: {
    labelFirstName: 'First Name',
    labelLastName: 'Last Name',
    labelEmail: 'Email',
    labelPassword: 'Password',
    signUp: 'Sign Up',
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
