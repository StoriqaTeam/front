// @flow strict
// @flow-runtime

import { t } from 'translation/utils';
import type { Translation } from 'translation/utils';

type TranslationDicType = {|
  addNewProduct: string,
  chooseWhatYouGonnaSale: string,
  labelProductName: string,
  labelShortDescription: string,
  productMainPhoto: string,
  labelAddPhoto: string,
  productPhotoGallery: string,
  forBetterProductAppeareance: string,
  iconAddMainPhoto: string,
  iconAddAngleView: string,
  iconShowDetails: string,
  iconShowInScene: string,
  iconShowInUse: string,
  iconShowSizes: string,
  iconShowVariety: string,
  characteristics: string,
  generalSettingsAndPricing: string,
  price: string,
  vendorCode: string,
  labelCashback: string,
  labelQuantity: string,
  save: string,
  cancel: string,
  productPhotos: string,
|};
type TranslationsBundleType = Translation<TranslationDicType>;

const translations: TranslationsBundleType = {
  en: {
    addNewProduct: 'Add new product',
    chooseWhatYouGonnaSale:
      'Choose what you gonna sale in your marketplace and add it with ease',
    labelProductName: 'Product Name',
    labelShortDescription: 'Short Description',
    productMainPhoto: 'Product Main Photo',
    labelAddPhoto: 'Add Photo',
    productPhotoGallery: 'Product photo gallery',
    forBetterProductAppeareance:
      '* For better product appearance follow recomendations below and upload appropriate photos:',
    iconAddMainPhoto: 'Add main photo',
    iconAddAngleView: 'Add angle view',
    iconShowDetails: 'Show Details',
    iconShowInScene: 'Show in scene',
    iconShowInUse: 'Show in use',
    iconShowSizes: 'Show sizes',
    iconShowVariety: 'Show variety',
    characteristics: 'Characteristics',
    generalSettingsAndPricing: 'General settings and pricing',
    price: 'Price',
    vendorCode: 'Vendor Code',
    labelCashback: 'Cash Back',
    labelQuantity: 'Quantity',
    save: 'Save',
    cancel: 'Cancel',
    productPhotos: 'PRODUCT PHOTOS',
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
