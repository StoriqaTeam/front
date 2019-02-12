// @flow strict
// @flow-runtime

import { t } from 'translation/utils';
import type { Translation } from 'translation/utils';

type TranslationDicType = {|
  nameMustNotBeEmpty: string,
  shortDescriptionMustNotBeEmpty: string,
  longDescriptionMustNotBeEmpty: string,
  slugMustNotBeEmpty: string,
  uploadMainPhoto: string,
  stronglyRecommendToUpload: string,
  size1360x350: string,
  altStoreCover: string,
  labelStoreName: string,
  labelLanguage: string,
  labelSlogan: string,
  labelShortDescription: string,
  labelLongDescription: string,
  save: string,
  close: string,
  sendToModeration: string,
  storeIsOnModeration: string,
  storeIsBlocked: string,
  longDescriptionLimitError: string,
  shopEditor: string,
|};
type TranslationsBundleType = Translation<TranslationDicType>;

const translations: TranslationsBundleType = {
  en: {
    nameMustNotBeEmpty: 'Name must not be empty',
    shortDescriptionMustNotBeEmpty: 'Short description must not be empty',
    longDescriptionMustNotBeEmpty: 'Long description must not be empty',
    slugMustNotBeEmpty: 'Slug must not be empty',
    uploadMainPhoto: 'Upload main photo',
    stronglyRecommendToUpload: 'Strongly recommend to upload:',
    size1360x350: '1360px × 350px | .jpg .jpeg .png',
    altStoreCover: 'Store Cover',
    labelStoreName: 'Store Name',
    labelLanguage: 'Language',
    labelSlogan: 'Slogan',
    labelShortDescription: 'Short Description',
    labelLongDescription: 'Long Description',
    save: 'Save',
    close: 'Close.',
    sendToModeration: 'Send to moderation',
    storeIsOnModeration: 'Store is on moderation',
    storeIsBlocked: 'Store is blocked, contact the support service',
    longDescriptionLimitError:
      'Long Description should be less than 8000 characters.',
    shopEditor: 'Shop Editor',
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
