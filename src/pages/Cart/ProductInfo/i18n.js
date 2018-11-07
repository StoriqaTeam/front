// @flow strict
// @flow-runtime

import { t } from 'translation/utils';
import type { Translation } from 'translation/utils';

type TranslationDicType = {|
  aboutProduct: string,
  availableForPreOrder: string,
  leadTime: string,
  price: string,
  count: string,
  subtotal: string,
  delivery: string,
  couponDiscount: string,
  labelCostumerComment: string,
  attention: string,
  noShippingAvailable: string,
  noCountryFound: string,
|};
type TranslationsBundleType = Translation<TranslationDicType>;

const translations: TranslationsBundleType = {
  en: {
    aboutProduct: 'About Product',
    availableForPreOrder: 'Available for pre-order.',
    leadTime: 'Lead time (days): ',
    price: 'Price',
    count: 'Count',
    subtotal: 'Subtotal',
    delivery: 'Delivery',
    couponDiscount: 'Coupon discount',
    labelCostumerComment: 'Customer comment',
    attention: 'Attention!',
    noShippingAvailable:
      'No shipping available for this product to your region.',
    noCountryFound: 'No country found',
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
