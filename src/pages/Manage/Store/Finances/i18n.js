// @flow strict
// @flow-runtime

import { t } from 'translation/utils';
import type { Translation } from 'translation/utils';

type TranslationDicType = {|
  paymentOptions: string,
  paymentAccount: string,
  balance: string,
  bankCards: string,
  addressCrypto: string,
  copied: string,
|};
type TranslationsBundleType = Translation<TranslationDicType>;

const translations: TranslationsBundleType = {
  en: {
    paymentOptions: 'PAYMENT OPTIONS',
    paymentAccount: 'PAYMENT ACCOUNT',
    balance: 'BALANCE',
    bankCards: 'Bank cards',
    addressCrypto: 'Address for crypto payments',
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
