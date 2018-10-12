// @flow strict

import { t } from 'translation/utils';
import type { Translation } from 'translation/utils';

const translations: Translation<{
  help: string,
  startSelling: string,
}> = {
  en: {
    help: 'Help',
    startSelling: 'Sell on Storiqa',
  },
  ru: {
    help: 'Помощь',
    startSelling: 'Начать продавать',
  },
};
export { translations };

export default t(translations);
