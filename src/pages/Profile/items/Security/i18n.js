// @flow strict
// @flow-runtime

import { t } from 'translation/utils';
import type { Translation } from 'translation/utils';

type TranslationDicType = {|
  passwordMustNotBeEmpty: string,
  notValidPassword: string,
  passwordHasNotChange: string,
  notTheSamePassword: string,
  somethingGoingWrong: string,
  close: string,
  error: string,
  securitySettings: string,
  passwordSuccessfullyUpdated: string,
  labelCurrentPassword: string,
  labelNewPassword: string,
  labelRepeatPassword: string,
  save: string,
  //
  confirmationDescription: string,
  resetPassword: string,
  confirmText: string,
  cancelText: string,
|};
type TranslationsBundleType = Translation<TranslationDicType>;

const translations: TranslationsBundleType = {
  en: {
    passwordMustNotBeEmpty: 'Password must not be empty',
    notValidPassword: 'Not valid password',
    passwordHasNotChange: 'Password has not changed',
    notTheSamePassword: 'Not the same password',
    somethingGoingWrong: 'Something going wrong :(',
    close: 'Close.',
    error: 'Error: ',
    securitySettings: 'Security Settings',
    passwordSuccessfullyUpdated: 'Password successfully updated!',
    labelCurrentPassword: 'Current password',
    labelNewPassword: 'New password',
    labelRepeatPassword: 'Repeat new password',
    save: 'Save', //
    confirmationDescription: 'Are you sure you want to reset?',
    resetPassword: 'Reset Password',
    confirmText: 'Yes, please',
    cancelText: 'Cancel',
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
