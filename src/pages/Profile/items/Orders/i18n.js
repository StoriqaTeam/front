// @flow strict
// @flow-runtime

import { t } from 'translation/utils';
import type { Translation } from 'translation/utils';

type TranslationDicType = {|
  theStoreWasDeleted: string,
  theProductWasDeleted: string,
  paid: string,
  notPaid: string,
|};
type TranslationsBundleType = Translation<TranslationDicType>;

const translations: TranslationsBundleType = {
  en: {
    theStoreWasDeleted: 'The Store was deleted',
    theProductWasDeleted: 'The Product was deleted',
    paid: 'Paid',
    notPaid: 'Not Paid',
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
