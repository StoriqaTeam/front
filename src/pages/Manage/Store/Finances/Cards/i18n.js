// @flow strict
// @flow-runtime

import { t } from 'translation/utils';
import type { Translation } from 'translation/utils';

type TranslationDicType = {|
  error: string,
  close: string,
  somethingGoingWrong: string,
  changeCardInfo: string,
  tableColumns: {
    cardTypeNumber: string,
    expirationDate: string,
    cardholderName: string,
  },
|};
type TranslationsBundleType = Translation<TranslationDicType>;

const translations: TranslationsBundleType = {
  en: {
    error: 'Error: ',
    close: 'Close.',
    somethingGoingWrong: 'Something going wrong :(',
    changeCardInfo: 'Change card info',
    tableColumns: {
      cardTypeNumber: 'Card type & number',
      expirationDate: 'Expiration date',
      cardholderName: 'Cardholder name',
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
