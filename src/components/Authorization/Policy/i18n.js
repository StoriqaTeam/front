// @flow strict
// @flow-runtime

import { t } from 'translation/utils';
import type { Translation } from 'translation/utils';

type TranslationDicType = {|
  checkHere: string,
  termsOfUse: string,
  and: string,
  privatePolicy: string,
  agree: string,
|};
type TranslationsBundleType = Translation<TranslationDicType>;

const translations: TranslationsBundleType = {
  en: {
    checkHere: 'Check here to indicate that you have read and agree to the',
    termsOfUse: 'Terms of Use',
    and: 'and',
    privatePolicy: 'Privacy Policy',
    agree: 'I agree to my personal data being stored and used.',
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