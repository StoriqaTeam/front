// @flow strict
// @flow-runtime

import { t } from 'translation/utils';
import type { Translation } from 'translation/utils';

type TranslationDicType = {|
  somethingGoingWrong: string,
  addressCreated: string,
  close: string,
  successForDeleteFromCart: string,
  errorInDeleteFromCart: string,
  ordersSuccessfullyCreated: string,
  error: string,
  somethingWentWrong: string,
  next: string,
  checkout: string,
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
    somethingGoingWrong: 'Something going wrong. New address was not created.',
    addressCreated: 'Address Created!',
    close: 'Closed.',
    successForDeleteFromCart: 'Success for DeleteFromCart mutation',
    errorInDeleteFromCart: 'Error in DeleteFromCart mutation',
    ordersSuccessfullyCreated: 'Orders successfully created',
    error: 'Error :(',
    somethingWentWrong: 'Something went wrong :(',
    next: 'Next',
    checkout: 'Checkout',
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
