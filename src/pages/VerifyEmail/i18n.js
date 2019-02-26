// @flow strict
// @flow-runtime

import { t } from 'translation/utils';
import type { Translation } from 'translation/utils';

type TranslationDicType = {|
  verifiedSuccessfully: string,
  somethingGoingWrong: string,
  close: string,
  loading: string,
  pleaseWait: string,
  storiqaTeam: string,
|};
type TranslationsBundleType = Translation<TranslationDicType>;

const translations: TranslationsBundleType = {
  en: {
    verifiedSuccessfully: 'Verified successfully',
    somethingGoingWrong: 'Something going wrong',
    close: 'Close.',
    loading: 'Loading...',
    pleaseWait: 'Please Wait',
    storiqaTeam: 'Storiqa team',
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
