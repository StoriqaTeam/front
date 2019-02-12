// @flow strict
// @flow-runtime

import { t } from 'translation/utils';
import type { Translation } from 'translation/utils';

type TranslationDicType = {|
  labelVariants: string,
  labelDelivery: string,
  nameIsRequired: string,
  shortDescriptionIsRequired: string,
  longDescriptionIsRequired: string,
  categoryIsRequired: string,
  vendorCodeIsRequired: string,
  priceIsRequired: string,
  metricsError: string,
  addAtLeastOneDeliveryServiceOrPickup: string,
  addAtLeastOneDeliveryDelivery: string,
  productPhotos: string,
  generalSettings: string,
  labelProductName: string,
  labelShortDescription: string,
  labelLongDescription: string,
  labelCurrency: string,
  labelVendorCode: string,
  labelSEOTitle: string,
  labelSEODescription: string,
  pricing: string,
  labelPrice: string,
  labelCashback: string,
  percent: string,
  labelDiscount: string,
  characteristics: string,
  availableForPreOrder: string,
  labelLeadTime: string,
  updateProduct: string,
  createProduct: string,
  currentlyYouHaveNoVariantsForYourProduct: string,
  addVariantsIfYouNeedSome: string,
  addVariant: string,
  save: string,
  sendToModeration: string,
  variantTabWarnMessages: {
    youCantAddVariant: string,
    thisCategory: string,
    сurrentlyThisOption: string,
  },
  baseProductIsOnModeration: string,
  baseProductIsBlocked: string,
  close: string,
|};
type TranslationsBundleType = Translation<TranslationDicType>;

const translations: TranslationsBundleType = {
  en: {
    labelVariants: 'Variants',
    labelDelivery: 'Delivery',
    nameIsRequired: 'Name is required',
    shortDescriptionIsRequired: 'Short description is required',
    longDescriptionIsRequired: 'Long description is required',
    categoryIsRequired: 'Category is required',
    vendorCodeIsRequired: 'Vendor code is required',
    priceIsRequired: 'Price is required',
    metricsError: 'Please, specify all metrics',
    addAtLeastOneDeliveryServiceOrPickup: 'Add at least one delivery service',
    addAtLeastOneDeliveryDelivery: 'Add at least one delivery service',
    productPhotos: 'Product photos',
    generalSettings: 'General settings',
    labelProductName: 'Product name',
    labelShortDescription: 'Short description',
    labelLongDescription: 'Long description',
    labelCurrency: 'Currency',
    labelVendorCode: 'Vendor code',
    labelSEOTitle: 'SEO title',
    labelSEODescription: 'SEO description',
    pricing: 'PRICING',
    labelPrice: 'Price',
    labelCashback: 'Cashback',
    percent: 'Percent',
    labelDiscount: 'Discount',
    characteristics: 'Characteristics',
    availableForPreOrder: 'Available for pre-order',
    labelLeadTime: 'Lead time (days)',
    updateProduct: 'Update product',
    createProduct: 'Create product',
    currentlyYouHaveNoVariantsForYourProduct:
      'Currently you have no variants for your product',
    addVariantsIfYouNeedSome: 'Add variants if you need some.',
    addVariant: 'Add variant',
    save: 'Save',
    sendToModeration: ' Send to moderation',
    variantTabWarnMessages: {
      youCantAddVariant:
        'You can’t add variant until you set at least one item characteristic.',
      thisCategory:
        'This category of goods does not require any characteristics.',
      сurrentlyThisOption:
        'Currently this option is unavailable while item editing.',
    },
    baseProductIsOnModeration: 'Product is on moderation',
    baseProductIsBlocked: 'Product is blocked, contact the support service',
    close: 'Close.',
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
