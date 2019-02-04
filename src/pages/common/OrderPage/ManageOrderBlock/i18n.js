// @flow strict
// @flow-runtime

import { t } from 'translation/utils';
import type { Translation } from 'translation/utils';

type TranslationDicType = {|
  sendYourProduct: string,
  toCustomer: string,
  doNotForgetToAttach: string,
  labelTrackNumber: string,
  labelComment: string,
  sendOrder: string,
  sendNow: string,
  confirmOrder: string,
  cancelOrder: string,
  cancelOrderTitle: string,
  cancelOrderDescription: string,
  cancelOrderConfirmText: string,
  cancelOrderCancelText: string,
  manage: string,
  storiqaFee: string,
  bankTransactionFee: string,
  chargeFee: string,
  status: string,
  areYouSureToPayChargeFee: string,
  pleaseCheckCard: string,
  cancel: string,
  payFee: string,
|};
type TranslationsBundleType = Translation<TranslationDicType>;

const translations: TranslationsBundleType = {
  en: {
    sendYourProduct: 'Send your Product',
    toCustomer: 'to customer',
    doNotForgetToAttach:
      'Do not forget to attach track number you get from delivery service used for product sending',
    labelTrackNumber: 'Track Number',
    labelComment: 'Comment',
    sendOrder: 'Send Order',
    sendNow: 'Send Now',
    confirmOrder: 'Confirm order',
    cancelOrder: 'Cancel order',
    cancelOrderTitle: 'Are you sure to cancel order?',
    cancelOrderDescription: '',
    cancelOrderConfirmText: 'Cancel order',
    cancelOrderCancelText: 'No',
    manage: 'Manage',
    storiqaFee: 'Storiqa fee',
    bankTransactionFee: 'Bank transaction fee',
    chargeFee: 'Charge fee',
    status: 'Status',
    areYouSureToPayChargeFee: 'Are you sure to pay charge fee?',
    pleaseCheckCard:
      'Please, check that you have connected payments card to your account in finances section and you have enough funds on it',
    cancel: 'Cancel',
    payFee: 'Pay fee',
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
