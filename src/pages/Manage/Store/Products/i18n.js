// @flow strict
// @flow-runtime

import { t } from 'translation/utils';
import type { Translation } from 'translation/utils';

type TranslationDicType = {|
  error: string,
  somethingGoingWrong: string,
  close: string,
  deleted: string,
  noProducts: string,
  loadMore: string,
|};
type TranslationsBundleType = Translation<TranslationDicType>;

const translations: TranslationsBundleType = {
  en: {
    error: 'Error: ',
    somethingGoingWrong: 'Something going wrong',
    close: 'Close.',
    deleted: 'Deleted!',
    noProducts: 'No products',
    loadMore: 'Load more',
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
