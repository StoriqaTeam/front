// @flow strict
// @flow-runtime

import { t } from 'translation/utils';
import type { Translation } from 'translation/utils';

type TranslationDicType = {|
  paid: string,
  notPaid: string,
  orderWasSuccessfullySent: string,
  orderWasSuccessfullyConfirm: string,
  somethingIsGoingWrong: string,
  orderSuccessfullyCanceled: string,
  orderSuccessfullyComplete: string,
  chargeFeefullyComplete: string,
  ok: string,
  order: string,
  orderStatusInfo: string,
  status: string,
  paymentInfo: string,
  havingTroubles: string,
  openTicket: string,
  invoice: string,
  theProductWasDeleted: string,
  thisProductWasBougthOnPreOrder: string,
  leadTime: string,
  labelCustomer: string,
  labelContacts: string,
  labelDate: string,
  labelTime: string,
  labelDelivery: string,
  labelDeliveryPrice: string,
  labelTrackID: string,
  labelQuantity: string,
  labelTotalAmount: string,
  labelCouponDiscount: string,
|};
type TranslationsBundleType = Translation<TranslationDicType>;

const translations: TranslationsBundleType = {
  en: {
    paid: 'Paid',
    notPaid: 'Not Paid',
    orderWasSuccessfullySent: 'Order was successfully sent.',
    orderWasSuccessfullyConfirm: 'Order was successfully confirm.',
    somethingIsGoingWrong: 'Something is going wrong :(',
    orderSuccessfullyCanceled: 'Order successfully canceled.',
    orderSuccessfullyComplete: 'Order successfully complete.',
    chargeFeefullyComplete: 'Charge fee successfully paid.',
    ok: 'Ok .',
    order: 'ORDER',
    orderStatusInfo: 'Order status info',
    status: 'Status',
    paymentInfo: 'Payment Info',
    havingTroubles: 'Having Troubles?',
    openTicket: 'Open Ticket',
    invoice: 'Invoice',
    theProductWasDeleted: 'The product was deleted',
    thisProductWasBougthOnPreOrder: 'This product was bought on pre-order.',
    leadTime: 'Lead time (days):',
    labelCustomer: 'Customer',
    labelContacts: 'Contacts',
    labelDate: 'Date',
    labelTime: 'Time',
    labelDelivery: 'Delivery',
    labelDeliveryPrice: 'Delivery price',
    labelTrackID: 'Track ID',
    labelQuantity: 'Quantity',
    labelTotalAmount: 'Total amount',
    labelCouponDiscount: 'Coupon discount',
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
