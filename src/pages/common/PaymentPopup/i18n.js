// @flow strict
// @flow-runtime

import { t } from 'translation/utils';
import type { Translation } from 'translation/utils';

type TranslationDicType = {|
  processingYourPayment: string,
  pleaseWaitForAwhile: string,
  close: string,
  payment: string,
  scanQRCodeWithinYourWalletApp: string,
  andPayInSeconds: string,
  address: string,
  amount: string,
  currentPriceReservedFor: string,
  iHavePaid: string,
|};
type TranslationsBundleType = Translation<TranslationDicType>;

const translations: TranslationsBundleType = {
  en: {
    processingYourPayment: 'Processing your payment.',
    pleaseWaitForAwhile: 'Plase wait for a while.',
    close: 'Close',
    payment: 'Payment',
    scanQRCodeWithinYourWalletApp: 'Scan QR-code within your wallet app',
    andPayInSeconds: 'and pay in a seconds',
    address: 'Address',
    amount: 'Amount',
    currentPriceReservedFor: 'Current price reserved for',
    iHavePaid: 'I have paid',
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
