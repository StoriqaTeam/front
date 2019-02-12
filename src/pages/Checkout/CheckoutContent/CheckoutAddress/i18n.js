// @flow strict
// @flow-runtime

import { t } from 'translation/utils';
import type { Translation } from 'translation/utils';

type TranslationDicType = {|
  deliveryInfo: string,
  labelReceiverName: string,
  labelReceiverPhone: string,
  labelChooseYourAddress: string,
  labelAddress: string,
  labelOrFillFields: string,
  labelSaveAsNewAddress: string,
|};
type TranslationsBundleType = Translation<TranslationDicType>;

const translations: TranslationsBundleType = {
  en: {
    deliveryInfo: 'Delivery Info',
    labelReceiverName: 'Receiver Name',
    labelReceiverPhone: 'Receiver Phone',
    labelChooseYourAddress: 'Choose your address',
    labelAddress: 'Address',
    labelOrFillFields: 'Fill fields below and save as address',
    labelSaveAsNewAddress: 'Save as a new address',
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
