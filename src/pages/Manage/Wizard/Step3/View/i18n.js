// @flow strict
// @flow-runtime

import { t } from 'translation/utils';
import type { Translation } from 'translation/utils';

type TranslationDicType = {|
  fillYouStoreWithGoods: string,
  pleaseAddTheProduct: string,
  currentlyYouHaveNoProducts: string,
  addFirstProduct: string,
  addNewProduct: string,
  deleteYourProduct: string,
  areYouSure: string,
  cancel: string,
  yesDeletePlease: string,
|};
type TranslationsBundleType = Translation<TranslationDicType>;

const translations: TranslationsBundleType = {
  en: {
    fillYouStoreWithGoods: 'Fill your store with goods',
    pleaseAddTheProduct:
      'Please add the product you would like to sell in your marketplace',
    currentlyYouHaveNoProducts:
      'Currently you have no products in your store. Click ‘Add’ to start filling your store with products.',
    addFirstProduct: 'Add first product',
    addNewProduct: 'Add new product',
    deleteYourProduct: 'Delete your product?',
    areYouSure:
      ' Are you sure you want to delete this listing? All the listing information will be discarded and cannot be retrieved.',
    cancel: 'Cancel',
    yesDeletePlease: 'Yes, delete, please',
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
