// @flow strict
// @flow-runtime

import { t } from 'translation/utils';
import type { Translation } from 'translation/utils';

type TranslationDicType = {|
  number: string,
  date: string,
  shop: string,
  delivery: string,
  items: string,
  price: string,
  status: string,
|};
type TranslationsBundleType = Translation<TranslationDicType>;

const translations: TranslationsBundleType = {
  en: {
    number: 'Number',
    date: 'Date',
    shop: 'Shop',
    delivery: 'Delivery',
    items: 'Items',
    price: 'Price',
    status: 'Status',
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
