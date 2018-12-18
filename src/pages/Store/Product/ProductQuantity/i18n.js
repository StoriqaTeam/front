// @flow strict
// @flow-runtime

import { t } from 'translation/utils';
import type { Translation } from 'translation/utils';

type TranslationDicType = {|
  amount: string,
  remainingStock: string,
  inStock: string,
  preOrder: string,
  availableForPreOrder: string,
  leadTime: string,
  numbersInWords: {
    dozens: string,
    hundreds: string,
  },
|};
type TranslationsBundleType = Translation<TranslationDicType>;

const translations: TranslationsBundleType = {
  en: {
    amount: 'Amount',
    remainingStock: 'Remaining stock:',
    inStock: 'In stock',
    preOrder: 'Pre order',
    availableForPreOrder: 'Available for pre-order.',
    leadTime: 'Lead time (days):',
    numbersInWords: {
      dozens: 'dozens',
      hundreds: 'hundreds',
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
