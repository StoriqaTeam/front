// @flow strict
// @flow-runtime

import { t } from 'translation/utils';
import type { Translation } from 'translation/utils';

type TranslationDicType = {|
  productPhotos: string,
  generalSettings: string,
  SKU: string,
  pricing: string,
  price: string,
  cashback: string,
  percent: string,
  discount: string,
  characteristics: string,
  save: string,
  cancel: string,
|};
type TranslationsBundleType = Translation<TranslationDicType>;

const translations: TranslationsBundleType = {
  en: {
    productPhotos: 'PRODUCT PHOTOS',
    generalSettings: 'GENERAL SETTINGS',
    SKU: 'SKU',
    pricing: 'Pricing',
    price: 'Price',
    cashback: 'Cashback',
    percent: 'Percent',
    discount: 'Discount',
    characteristics: 'Characteristics',
    save: 'Save',
    cancel: 'Cancel',
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
