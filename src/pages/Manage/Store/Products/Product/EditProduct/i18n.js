// @flow strict
// @flow-runtime

import { t } from 'translation/utils';
import type { Translation } from 'translation/utils';

type TranslationDicType = {|
  somethingGoingWrong: string,
  close: string,
  error: string,
  productUpdated: string,
  validationError: string,
  deliveryUpdated: string,
  productNotFound: string,
|};
type TranslationsBundleType = Translation<TranslationDicType>;

const translations: TranslationsBundleType = {
  en: {
    somethingGoingWrong: 'Something going wrong :(',
    close: 'Close.',
    error: 'Error: ',
    productUpdated: 'Product update!',
    validationError: 'Validation Error!',
    deliveryUpdated: 'Delivery update!',
    productNotFound: 'Product not found',
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
