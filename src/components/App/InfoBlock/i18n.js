// @flow strict
// @flow-runtime

import { t } from 'translation/utils';
import type { Translation } from 'translation/utils';

type TranslationDicType = {|
  aboutStoriqa: string,
  privacyPolicy: string,
  help: string,
  termsOfUse: string,
  address: string,
|};

type TranslationsBundleType = Translation<TranslationDicType>;

const translations: TranslationsBundleType = {
  en: {
    aboutStoriqa: 'About Storiqa',
    privacyPolicy: 'Privacy Policy',
    help: 'Help',
    termsOfUse: 'Terms of Use',
    address: 'Head Office Unit 617, 6/F 131-132 Connaught Road West Hong Kong',
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
