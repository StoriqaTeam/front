// @flow strict
// @flow-runtime

import { t } from 'translation/utils';
import type { Translation } from 'translation/utils';

type TranslationDicType = {|
  signIn: string,
  signUp: string,
  recoverPassword: string,
  registrationSuccessful: string,
  pleaseVerifyYourEmail: string,
  passwordResetSuccessfully: string,
  emailNotFound: string,
  verificationEmailSentSuccessfully: string,
  resetPassword: string,
  pleaseTypeNewPassword: string,
|};
type TranslationsBundleType = Translation<TranslationDicType>;

const translations: TranslationsBundleType = {
  en: {
    signIn: 'Sign In',
    signUp: 'Sign Up',
    recoverPassword: 'Recover Password',
    registrationSuccessful:
      'Registration successful, please confirm your email and login.',
    pleaseVerifyYourEmail: 'Please verify your email',
    passwordResetSuccessfully: 'Password Reset Successfully',
    emailNotFound: 'Email Not Found',
    verificationEmailSentSuccessfully: 'Verification Email Sent Successfully',
    resetPassword: 'Reset Password',
    pleaseTypeNewPassword: 'Please Type new password',
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
