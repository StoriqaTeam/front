// @flow strict
// @flow-runtime

import { t } from 'translation/utils';
import type { Translation } from 'translation/utils';

type TranslationDicType = {|
  subtotal: string,
  applyCode: string,
  somethingGoingWrong: string,
  close: string,
  error: string,
  unknownError: string,
  couponApplied: string,
|};
type TranslationsBundleType = Translation<TranslationDicType>;

const translations: TranslationsBundleType = {
  en: {
    subtotal: 'Subtotal',
    applyCode: 'Apply code',
    somethingGoingWrong: 'Something going wrong :(',
    close: 'Close.',
    error: 'Error: ',
    unknownError: 'Unknown error.',
    couponApplied: 'Сoupon applied!',
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
