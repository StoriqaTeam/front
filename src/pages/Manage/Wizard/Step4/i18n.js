// @flow strict
// @flow-runtime

import { t } from 'translation/utils';
import type { Translation } from 'translation/utils';

type TranslationDicType = {|
  fillTheCardInformation: string,
  yourCardWillBe: string,
  learnMore: string,
  paymentMethodForPlacingGoods: string,
  chooseTheMethodOfPayment: string,
  fiatPrice: string,
  cryptoPrice: string,
  perDay: string,
  theMoneyWillBeWithdrawn: string,
  specialWalletWillBeCreated: string,
|};
type TranslationsBundleType = Translation<TranslationDicType>;

const translations: TranslationsBundleType = {
  en: {
    fillTheCardInformation: 'Fill the Card information',
    yourCardWillBe:
      'Your card will be charged for placing goods on the platform. The first 30 days for free.',
    learnMore: 'Learn more',
    paymentMethodForPlacingGoods: 'Payment method for placing goods',
    chooseTheMethodOfPayment:
      'Choose the method of payment for placing your goods on the platform. You get a Trial Period of first 30 days for free',
    fiatPrice: '3 cents',
    cryptoPrice: '1 STQ',
    perDay: 'per day',
    theMoneyWillBeWithdrawn:
      'The money will be withdrawn from your card that you indicated earlier',
    specialWalletWillBeCreated:
      'A special wallet will be created for you. You can conveniently and profitably pay your commission with cryptocurrency',
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
