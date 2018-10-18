// @flow strict
// @flow-runtime

import { t } from 'translation/utils';
import type { Translation } from 'translation/utils';

type TranslationDicType = {|
  oneLowerCaseCharacter: string,
  oneUpperCaseCharacter: string,
  oneNumber: string,
  eightCharactersMinimun: string,
|};
type TranslationsBundleType = Translation<TranslationDicType>;

const translations: TranslationsBundleType = {
  en: {
    oneLowerCaseCharacter: 'One lower case character',
    oneUpperCaseCharacter: 'One upper case character',
    oneNumber: 'One number',
    eightCharactersMinimun: '8 characters minimum',
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