// @flow strict
// @flow-runtime

import { t } from 'translation/utils';
import type { Translation } from 'translation/utils';

type TranslationDicType = {|
  areYouSureToCancelOrder: string,
  sendYourProduct: string,
  toCustomer: string,
  doNotForgetToAttach: string,
  labelTrackNumber: string,
  labelComment: string,
  sendOrder: string,
  sendNow: string,
  cancelOrder: string,
|};
type TranslationsBundleType = Translation<TranslationDicType>;

const translations: TranslationsBundleType = {
  en: {
    areYouSureToCancelOrder: 'Are you sure to cancel order?',
    sendYourProduct: 'Send your Product',
    toCustomer: 'to customer',
    doNotForgetToAttach:
      'Do not forget to attach track number you get from delivery service used for product sending',
    labelTrackNumber: 'Track Number',
    labelComment: 'Comment',
    sendOrder: 'Send Order',
    sendNow: 'Send Now',
    cancelOrder: 'Cancel Order',
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
