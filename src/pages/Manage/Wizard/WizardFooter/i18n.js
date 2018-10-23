// @flow strict
// @flow-runtime

import { t } from 'translation/utils';
import type { Translation } from 'translation/utils';

type TranslationDicType = {|
  goBack: string,
  thisListingIsntActiveYet: string,
  nextStep: string,
  publishStore: string,
|};
type TranslationsBundleType = Translation<TranslationDicType>;

const translations: TranslationsBundleType = {
  en: {
    goBack: 'Go back',
    thisListingIsntActiveYet: 'This listing isn’t active yet. It will be available to shoppers once you open your shop.',
    nextStep: 'Next Step',
    publishStore: 'Publish Store',
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

