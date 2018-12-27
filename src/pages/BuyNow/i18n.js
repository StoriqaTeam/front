// @flow strict
// @flow-runtime

import { t } from 'translation/utils';
import type { Translation } from 'translation/utils';

type TranslationDicType = {|
  receiverNameIsRequired: string,
  receiverPhoneIsRequired: string,
  success: string,
  orderSuccessfullyCreated: string,
  somethingWentWrong: string,
  close: string,
  error: string,
  somethingGoingWrongNewAddressWasNotCreated: string,
  addressCreated: string,
  couponNotFound: string,
  couponAlreadyApplied: string,
  couponApplied: string,
  deliveryApplied: string,
  deliveryInfo: string,
  labelReceiverName: string,
  labelReceiverPhone: string,
  labelChooseYourAddress: string,
  labelAddress: string,
  labelOrFillFieldsBelowAndSaveAsAddress: string,
  labelSaveAsANewAddress: string,
  errors: {
    receiverNameRequired: string,
    receiverPhoneRequired: string,
    areRequired: string,
    country: string,
    address: string,
    postalCode: string,
  },
|};
type TranslationsBundleType = Translation<TranslationDicType>;

const translations: TranslationsBundleType = {
  en: {
    receiverNameIsRequired: 'Receiver name is required',
    receiverPhoneIsRequired: 'Receiver phone is required',
    success: 'Success',
    orderSuccessfullyCreated: 'Order Successfully Created',
    somethingWentWrong: 'Something went wrong :(',
    close: 'Close.',
    error: 'Error :( ',
    somethingGoingWrongNewAddressWasNotCreated:
      'Something going wrong. New address was not created.',
    addressCreated: 'Address created!',
    couponNotFound: 'coupon not found',
    couponAlreadyApplied: 'coupon already applied',
    couponApplied: 'coupon applied!',
    deliveryApplied: 'Delivery applied!',
    deliveryInfo: 'Delivery info',
    labelReceiverName: 'Receiver name',
    labelReceiverPhone: 'Receiver phone',
    labelChooseYourAddress: 'Choose your address',
    labelAddress: 'Address',
    labelOrFillFieldsBelowAndSaveAsAddress:
      'Fill fields below and save as address',
    labelSaveAsANewAddress: 'Save as a new address',
    errors: {
      receiverNameRequired: 'Receiver name is required',
      receiverPhoneRequired: 'Receiver phone is required',
      areRequired: 'are required',
      country: 'country',
      address: 'address',
      postalCode: 'postal code',
    },
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
