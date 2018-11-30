// @flow strict
// @flow-runtime

import { t } from 'translation/utils';
import type { Translation } from 'translation/utils';

type TranslationDicType = {|
  somethingGoingWrongWithShipping: string,
  close: string,
  noCategory: string,
  somethingGoingWrong: string,
  error: string,
  productCreated: string,
  validationError: string,
|};
type TranslationsBundleType = Translation<TranslationDicType>;

const translations: TranslationsBundleType = {
  en: {
    somethingGoingWrongWithShipping: 'Something going wrong with shipping :(',
    close: 'Close.',
    noCategory: 'No category :(',
    somethingGoingWrong: 'Something going wrong :(',
    error: 'Error: ',
    productCreated: 'Product created!',
    validationError: 'Validation Error!',
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
