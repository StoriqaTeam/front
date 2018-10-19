// @flow strict
// @flow-runtime

import { t } from 'translation/utils';
import type { Translation } from 'translation/utils';

type TranslationDicType = {|
  total: string,
  paymentMethods: string,
  cryptoPayments: string,
  productsCost: string,
  deliveryCost: string,
  checkout: string,
|};
type TranslationsBundleType = Translation<TranslationDicType>;

const translations: TranslationsBundleType = {
  en: {
    total: 'Total',
    paymentMethods: 'Payment Methods',
    cryptoPayments: 'Crypto Payments',
    productsCost: 'Products Cost',
    deliveryCost: 'Delivery Cost', 
    checkout: 'Checkout',
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
