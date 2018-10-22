// @flow strict
// @flow-runtime

import { t } from 'translation/utils';
import type { Translation } from 'translation/utils';

type TranslationDicType = {|
  summary: string,
  address: string,
  replaceAddress: string,
|};
type TranslationsBundleType = Translation<TranslationDicType>;

const translations: TranslationsBundleType = {
  en: {
    summary: 'Summary',
    address: 'Address',
    replaceAddress: 'Replace Address',
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
