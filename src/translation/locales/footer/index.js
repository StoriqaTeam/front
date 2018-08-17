// @flow

import type { LanguagesType } from 'translation/types/LanguagesType';
import type { FooterType } from 'translation/types/FooterType';

type LocalType = {
  [LanguagesType]: FooterType,
};

const locale: LocalType = {
  en: {
    storiqa_market: 'Storiqa market',
    sections: 'Sections',
    services: 'Services',
  },
  ru: {
    storiqa_market: 'Рынок Storiqa',
    sections: 'Разделы',
    services: 'Сервисы',
  },
  ja: {
    storiqa_market: 'ストリオカ市場',
    sections: 'セクション',
    services: 'サービス',
  },
  kk: {
    storiqa_market: 'Storiqa нарығы',
    sections: 'Бөлімдер',
    services: 'Қызметтер',
  },
};

export default locale;
