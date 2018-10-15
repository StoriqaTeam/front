// @flow strict
// @flow-runtime

import { t } from 'translation/utils';
import type { Translation } from 'translation/utils';

type TranslationDicType = {|
  help: string,
  startSelling: string,
|};
type TranslationsBundleType = Translation<TranslationDicType>;

const translations: TranslationsBundleType = {
  en: {
    help: 'Help',
    startSelling: 'Sell on Storiqa',
  },
  ru: {
    help: 'Помощь',
    startSelling: 'Начать продавать',
  },
};

// TODO: made for non-production
const validate = (json: {}, verbose: boolean = false): boolean => {
  try {
    (json: TranslationsBundleType); // eslint-disable-line
    return true;
  } catch (err) {
    verbose && console.error(err); // eslint-disable-line
    return false;
  }
};

export default t(translations);
export { validate, translations };
