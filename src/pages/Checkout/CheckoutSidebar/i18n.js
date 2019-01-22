// @flow strict
// @flow-runtime

import { t } from 'translation/utils';
import type { Translation } from 'translation/utils';

type TranslationDicType = {|
  subtotal: string,
  paymentMethod: string,
  total: string,
  delivery: string,
  items: string,
  couponsDiscount: string,
|};
type TranslationsBundleType = Translation<TranslationDicType>;

const translations: TranslationsBundleType = {
  en: {
    subtotal: 'Subtotal',
    paymentMethod: 'Payment method',
    total: 'Total',
    delivery: 'Delivery',
    items: 'items',
    couponsDiscount: 'Coupons discount',
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
