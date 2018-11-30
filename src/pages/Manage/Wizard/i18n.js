// @flow strict
// @flow-runtime

import { t } from 'translation/utils';
import type { Translation } from 'translation/utils';

type TranslationDicType = {|
  unknownError: string,
  close: string,
  cantCreateVariantWithoutBaseProductId: string,
  error: string,
  productUpdated: string,
  somethingGoingWrong: string,
  cantUploadPhoto: string,
  doYouReallyWantToLeaveThisPage: string,
  cancel: string,
  publishMyStore: string,
|};
type TranslationsBundleType = Translation<TranslationDicType>;

const translations: TranslationsBundleType = {
  en: {
    unknownError: 'Unknown error',
    close: 'Close.',
    cantCreateVariantWithoutBaseProductId:
      "Can't create variant without base product id",
    error: 'Error',
    productUpdated: 'Product updated!',
    somethingGoingWrong: 'Something going wrong :(',
    cantUploadPhoto: "Can't upload photo",
    doYouReallyWantToLeaveThisPage: 'Do you really want to leave this page?',
    cancel: 'Cancel',
    publishMyStore: 'Publish my store',
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
