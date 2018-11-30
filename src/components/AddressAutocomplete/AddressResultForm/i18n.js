// @flow strict
// @flow-runtime

import { t } from 'translation/utils';
import type { Translation } from 'translation/utils';

type TranslationDicType = {|
  labelAptSuiteOther: string,
  labelStreetAddress: string,
  labelLocality: string,
  labelRegionState: string,
  labelAreaDistrict: string,
  labelPostalCode: string,
|};
type TranslationsBundleType = Translation<TranslationDicType>;

const translations: TranslationsBundleType = {
  en: {
    labelAptSuiteOther: 'Apt / Suite / Other',
    labelStreetAddress: 'Street Address',
    labelLocality: 'Locality',
    labelRegionState: 'Region / State',
    labelAreaDistrict: 'Area / District',
    labelPostalCode: 'Postal Code',
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
