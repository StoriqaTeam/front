// @flow strict
// @flow-runtime

import { t } from 'translation/utils';
import type { Translation } from 'translation/utils';

type TranslationDicType = {|
  labelWebAddress: string,
  inUse: string,
  vacant: string,
  oops: string,
  hoorah: string,
|};
type TranslationsBundleType = Translation<TranslationDicType>;

const translations: TranslationsBundleType = {
  en: {
    labelWebAddress: 'Web Address',
    inUse: 'In Use',
    vacant: 'Vacant',
    oops: 'Oops! Someone has already using this address.',
    hoorah: 'Hoorah! Name is vacant!',
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