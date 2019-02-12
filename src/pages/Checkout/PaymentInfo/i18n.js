// @flow strict
// @flow-runtime

import { t } from 'translation/utils';
import type { Translation } from 'translation/utils';

type TranslationDicType = {|
  order: string,
  exchangeNotification: string,
  attention: string,
  ok: string,
  myOrders: string,
|};
type TranslationsBundleType = Translation<TranslationDicType>;

const translations: TranslationsBundleType = {
  en: {
    order: 'Order',
    exchangeNotification:
      "Cashback will be sent to the address used for a payment. Don't use exchanges addresses as we can't guarantee cashback receipt in this case.",
    attention: 'Attention!',
    ok: 'ok',
    myOrders: 'My orders',
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
