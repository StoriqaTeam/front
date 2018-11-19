// @flow strict
// @flow-runtime

import { t } from 'translation/utils';
import type { Translation } from 'translation/utils';

type TranslationDicType = {|
  internationalShipping: string,
  withoutInternationalDelivery: string,
  fixedSinglePriceForAll: string,
  noAvailablePackages: string,
|};
type TranslationsBundleType = Translation<TranslationDicType>;

const translations: TranslationsBundleType = {
  en: {
    internationalShipping: 'International shipping',
    withoutInternationalDelivery: 'Without international delivery',
    fixedSinglePriceForAll: 'Fixed, single price for all',
    noAvailablePackages: 'No available packages',
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
