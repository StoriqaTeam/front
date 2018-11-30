// @flow strict
// @flow-runtime

import { t } from 'translation/utils';
import type { Translation } from 'translation/utils';

type TranslationDicType = {|
  oopsItSeemsThatThePageDoesntExist: string,
  tryToStartAgain: string,
  startFromMainPage: string,
  back: string,
|};
type TranslationsBundleType = Translation<TranslationDicType>;

const translations: TranslationsBundleType = {
  en: {
    oopsItSeemsThatThePageDoesntExist:
      '"Oops! Seems that the page you searching doesn\'t exist."',
    tryToStartAgain: 'Try to start again from main page or use search tool.',
    startFromMainPage: 'Start from main page',
    back: 'Back',
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
