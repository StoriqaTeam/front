// @flow

import type { LanguagesType } from 'translation/types/LanguagesType';
import type { HeaderType } from 'translation/types/HeaderType';

type LocalType = {
  [LanguagesType]: HeaderType,
};

const locale: LocalType = {
  en: {
    help: 'Help',
    sell_on_storiqa: 'Sell on Storiqa',
    products: 'Products',
    stores: 'Stores',
    i_find: 'I find...',
    sign_up: 'Sign Up',
    sign_in: 'Sign In',
  },
  ru: {
    help: 'Помощь',
    sell_on_storiqa: 'Продать на Storiqa',
    products: 'Товары',
    stores: 'Магазины',
    i_find: 'Я ищу...',
    sign_up: 'Зарегестрироваться',
    sign_in: 'Войти',
  },
  ja: {
    help: '助けて',
    sell_on_storiqa: 'Storiqaで売る',
    products: '製品',
    stores: '店舗',
    i_find: '私は見つける...',
    sign_up: 'サインアップ',
    sign_in: 'サインイン',
  },
  kk: {
    help: '«Анықтама»',
    sell_on_storiqa: 'Нарықта сатады',
    products: '«Тауарлар»',
    stores: 'Дүкендер',
    i_find: 'Мен іздеймін ...',
    sign_up: '«Тіркелу»',
    sign_in: 'Кіру',
  },
};

export default locale;
