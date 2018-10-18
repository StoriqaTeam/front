// @flow strict
// @flow-runtime

import { t } from 'translation/utils';
import type { Translation } from 'translation/utils';

type TranslationDicType = {|
  labelEmail: string,
  labelPassword: string,
  forgotPassword: string,
  signIn: string,
  emailNotVerified: string,
|};
type TranslationsBundleType = Translation<TranslationDicType>;

const translations: TranslationsBundleType = {
  en: {
    labelEmail: 'Email',
    labelPassword: 'Password',
    forgotPassword: 'ForgotPassword',
    signIn: 'Sign In',
    emailNotVerified: 'Email not verified',
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