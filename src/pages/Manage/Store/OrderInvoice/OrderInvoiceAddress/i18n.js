// @flow strict
// @flow-runtime

import { t } from 'translation/utils';
import type { Translation } from 'translation/utils';

type TranslationDicType = {|
  postalCode: string,
  country: string,
  region: string,
  locality: string,
  areaDistrict: string,
  street: string,
  aptSuiteOther: string,
  email: string,
  phoneNumber: string,
|};
type TranslationsBundleType = Translation<TranslationDicType>;

const translations: TranslationsBundleType = {
  en: {
    postalCode: 'Postal Code',
    country: 'Country',
    region: 'Region',
    locality: 'Locality',
    areaDistrict: 'Area/District',
    street: 'Street',
    aptSuiteOther: 'Apt/Suite/Other',
    email: 'Email',
    phoneNumber: 'Phone Number',
  }
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