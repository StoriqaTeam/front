// @flow strict
// @flow-runtime

import { t } from 'translation/utils';
import type { Translation } from 'translation/utils';

type TranslationDicType = {|
  storiqaMarket: string,
  storiqaMarket_sales: string,
  storiqaMarket_recommended: string,
  storiqaMarket_popular: string,
  storiqaMarket_reviews: string,
  //
  sections: string,
  sections_showcase: string,
  sections_goods: string,
  sections_shop: string,
  sections_storiqaCommunity: string,
  //
  services: string,
  services_qualityAssurance: string,
  services_storiqaWallet: string,
  //
  logoDescription: string,
  copyRight: string,
  startSelling: string,
  offscreenSections: string,
|};

type TranslationsBundleType = Translation<TranslationDicType>;

const translations: TranslationsBundleType = {
  en: {
    storiqaMarket: 'Storiqa Market',
    storiqaMarket_sales: 'Sales',
    storiqaMarket_recommended: 'Recommended',
    storiqaMarket_popular: 'Popular',
    storiqaMarket_reviews: 'Reviews',
    //
    sections: 'Sections',
    sections_showcase: 'Showcase',
    sections_goods: 'Goods',
    sections_shop: 'Shop',
    sections_storiqaCommunity: 'Storiqa Community',
    //
    services: 'Services',
    services_qualityAssurance: 'Quality Assurance',
    services_storiqaWallet: 'Storiqa Wallet',
    //
    logoDescription:
      'Storiqa is a global marketplace for any kind of legal goods supporting cryptocurrency payments',
    copyRight: '© Storiqa Marketplace. All rights reserved. 2018',
    startSelling: 'Start selling',
    offscreenSections: 'Storiqa Sections',
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
