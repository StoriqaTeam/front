// @flow strict
// @flow-runtime

import { t } from 'translation/utils';
import type { Translation } from 'translation/utils';

type TranslationDicType = {|
  error: string,
  yourPaymentWasFailed: string,
  payment: string,
  someDescription: string,
  success: string,
  yourPaymentWasSuccessfullyCompleted: string,
  alreadyPaid: string,
  myOrders: string,
|};
type TranslationsBundleType = Translation<TranslationDicType>;

const translations: TranslationsBundleType = {
  en: {
    error: 'Error',
    yourPaymentWasFailed: 'Your payment was failed :(',
    payment: 'Payment',
    someDescription: 'Some description',
    success: 'Success',
    yourPaymentWasSuccessfullyCompleted:
      'Your payment was successfully completed.',
    alreadyPaid: 'Already paid',
    myOrders: 'My orders',
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
