// @flow

import type { LanguagesType } from 'translation/types/LanguagesType';
import type { StartType } from 'translation/types/StartType';

type LocalType = {
  [LanguagesType]: StartType,
};

const locale: LocalType = {
  en: {
    most_popular: 'Most popular',
    sale: 'Sale',
    see_all: 'See all',
  },
  ru: {
    most_popular: 'Популярные',
    sale: 'Распродажа',
    see_all: 'Все',
  },
  ja: {
    most_popular: '最も人気のある',
    sale: '販売',
    see_all: 'すべてを見る',
  },
  kk: {
    most_popular: 'Ең танымал',
    sale: 'Сатылым',
    see_all: 'Барлығын көру',
  },
};

export default locale;
