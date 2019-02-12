// @flow strict
// @flow-runtime

import { t } from 'translation/utils';
import type { Translation } from 'translation/utils';

type TranslationDicType = {|
  goods: string,
  storiqaMarket_sales: string,
  storiqaMarket_popular: string,
  //
  marketplace: string,
  marketplace_termsOfUse: string,
  marketplace_privacyPolicy: string,
  marketplace_listOfProhibitedGoods: string,
  //
  services: string,
  services_storiqaWallet: string,
  services_sellingGuides: string,
  services_helpCenter: string,
  //
  copyRight: string,
  allRightsReserved: string,
  startTrade: string,
  offscreenSections: string,
  wannaSellYourGoodsGlobally: string,
  storiqaIsAGlobalMarketPlace: string,
|};

type TranslationsBundleType = Translation<TranslationDicType>;

const translations: TranslationsBundleType = {
  en: {
    goods: 'Goods',
    storiqaMarket_sales: 'Sales',
    storiqaMarket_popular: 'Popular',
    //
    marketplace: 'Marketplace',
    marketplace_termsOfUse: 'Terms of use',
    marketplace_privacyPolicy: 'Privacy Policy',
    marketplace_listOfProhibitedGoods: 'List of Prohibited Goods',
    //
    services: 'Services',
    services_storiqaWallet: 'Storiqa Wallet',
    services_sellingGuides: 'Selling guides',
    services_helpCenter: 'Help center',
    //
    copyRight:
      '© Storiqa Marketplace DBA Storiqa Global Trades Inc. (Head Office Unit 617, 6/F 131-132 Connaught Road West Hong Kong)',
    allRightsReserved: 'All rights reserved.',
    startTrade: 'Start Trade',
    offscreenSections: 'Storiqa Sections',
    wannaSellYourGoodsGlobally: 'Wanna sell your goods globally?',
    storiqaIsAGlobalMarketPlace:
      'Storiqa is a global marketplace for any kind of legal goods supporting cryptocurrency payments',
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
