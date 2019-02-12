// @flow strict
// @flow-runtime

import { t } from 'translation/utils';
import type { Translation } from 'translation/utils';

type TranslationDicType = {|
  delivery: string,
  price: string,
  warning: string,
  sellerDoesNotShip: string,
|};
type TranslationsBundleType = Translation<TranslationDicType>;

const translations: TranslationsBundleType = {
  en: {
    delivery: 'Delivery',
    price: 'Price',
    warning:
      'International items may be subject to customs processing and additional charges',
    sellerDoesNotShip: 'Seller does not ship to selected country',
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
