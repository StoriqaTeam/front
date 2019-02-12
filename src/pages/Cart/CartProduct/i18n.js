// @flow strict
// @flow-runtime

import { t } from 'translation/utils';
import type { Translation } from 'translation/utils';

type TranslationDicType = {|
  successForDeleteFromCart: string,
  errorInDeleteFromCart: string,
  unableToDeleteProductQuantity: string,
  //
  successForSetSelectionInCart: string,
  errorInSetSelectionInCart: string,
  unableToSetProductSelection: string,
  //
  successForSetQuantityInCart: string,
  errorInSetQuantityInCart: string,
  unableToSetProductQuantity: string,
  //
  successForSetCommentInCart: string,
  errorInSetCommentInCart: string,
  unableToSetComment: string,
  //
  close: string,
  response: string,
  errors: string,
  //
  confirmationDescription: string,
  deleteYourProduct: string,
  confirmText: string,
  cancelText: string,
|};
type TranslationsBundleType = Translation<TranslationDicType>;

const translations: TranslationsBundleType = {
  en: {
    successForDeleteFromCart: 'Success for DeleteFromCart mutation',
    errorInDeleteFromCart: 'Error in DeleteFromCart mutation',
    unableToDeleteProductQuantity: 'Unable to delete product quantity in cart',
    //
    successForSetSelectionInCart: 'Success for SetSelectionInCart mutation',
    errorInSetSelectionInCart: 'Error in SetSelectionInCart mutation',
    unableToSetProductSelection: 'Unable to set product selection in cart',
    //
    successForSetQuantityInCart: 'Success for SetQuantityInCart mutation',
    errorInSetQuantityInCart: 'Error in SetQuantityInCart mutation',
    unableToSetProductQuantity: 'Unable to set product quantity in cart',
    //
    successForSetCommentInCart: 'Success for SetCommentInCart mutation',
    errorInSetCommentInCart: 'Error in SetCommentInCart mutation',
    unableToSetComment: 'Unable to set comment for product',
    //
    close: 'Close',
    response: 'Response: ',
    errors: 'Errors: ',
    //
    confirmationDescription:
      'Are you sure you want to delete this listing? All the listing information will be discarded and cannot be retrieved.',
    deleteYourProduct: 'Delete your product?',
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
