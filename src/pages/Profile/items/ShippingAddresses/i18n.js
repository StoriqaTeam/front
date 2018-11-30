// @flow strict
// @flow-runtime

import { t } from 'translation/utils';
import type { Translation } from 'translation/utils';

type TranslationDicType = {|
  error: string,
  close: string,
  countryIsRequiredParameter: string,
  postalCodeIsRequiredParameter: string,
  countryAndPostalCodeIsRequiredParameter: string,
  somethingWentWrong: string,
  addressDeleted: string,
  save: string,
  add: string,
  cancel: string,
  shippingAddress: string,
  addAddress: string,
  savedAddresses: string,
  priorityAddress: string,
  edit: string,
  delete: string,
|};
type TranslationsBundleType = Translation<TranslationDicType>;

const translations: TranslationsBundleType = {
  en: {
    error: 'Error: ',
    close: 'Close.',
    countryIsRequiredParameter: 'Country is required parameter',
    postalCodeIsRequiredParameter: 'Postal Code is required parameter',
    countryAndPostalCodeIsRequiredParameter:
      'Country and Postal Code is required parameter',
    somethingWentWrong: 'Something going wrong :(',
    addressDeleted: 'Address deleted!',
    save: 'Save',
    add: 'Add',
    cancel: 'Cancel',
    shippingAddress: 'Shipping address',
    addAddress: 'Add address',
    savedAddresses: 'Saved addresses',
    priorityAddress: 'Priority address',
    edit: 'Edit',
    delete: 'Delete',
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
