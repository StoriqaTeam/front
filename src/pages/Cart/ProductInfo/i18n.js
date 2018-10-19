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
  labelCostumerComment: string,
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
    labelCostumerComment: 'Customer comment',
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
