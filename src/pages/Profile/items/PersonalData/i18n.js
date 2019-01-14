// @flow strict
// @flow-runtime

import { t } from 'translation/utils';
import type { Translation } from 'translation/utils';

type TranslationDicType = {|
  firstNameMustNotBeEmpty: string,
  lastNameMustNotBeEmpty: string,
  error: string,
  close: string,
  save: string,
  somethingGoingWrong: string,
  userUpdated: string,
  personalDataSettings: string,
  labelFirstName: string,
  labelLastName: string,
  labelGender: string,
  labelBirthdate: string,
  labelPhone: string,
  labelRefLink: string,
  copied: string,
|};
type TranslationsBundleType = Translation<TranslationDicType>;

const translations: TranslationsBundleType = {
  en: {
    firstNameMustNotBeEmpty: 'First name must not be empty',
    lastNameMustNotBeEmpty: 'Last name must not be empty',
    error: 'Error: ',
    close: 'Close.',
    save: 'Save',
    somethingGoingWrong: 'Something going wrong :(',
    userUpdated: 'User data updated!',
    personalDataSettings: 'Personal data settings',
    labelFirstName: 'First name',
    labelLastName: 'Last name',
    labelGender: 'Gender',
    labelBirthdate: 'Birthday',
    labelPhone: 'Phone',
    labelRefLink: 'Referral link',
    copied: 'Copied',
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
