// @flow strict
// @flow-runtime

import { t } from 'translation/utils';
import type { Translation } from 'translation/utils';

type TranslationDicType = {|
  deleteVariant: string,
  confirmationDescription: string,
  close: string,
  somethingWentWrong: string,
  variantDeleted: string,
  error: string,
  confirmText: string,
  cancelText: string,
|};
type TranslationsBundleType = Translation<TranslationDicType>;

const translations: TranslationsBundleType = {
  en: {
    deleteVariant: 'Delete this variant?',
    confirmationDescription:
      'Are you sure you want to delete this variant? All the variant information will be discarded and cannot be retrieved.',
    close: 'Close.',
    somethingWentWrong: 'Something going wrong :(',
    variantDeleted: 'Variant deleted!',
    error: 'Error:',
    confirmText: 'Yes, delete, please',
    cancelText: 'Cancel',
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
