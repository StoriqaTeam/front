// @flow strict

import { getCookie } from 'utils';

const getCurrentCurrency = (currencyType?: ?'FIAT' | ?'CRYPTO') => {
  if (currencyType === 'FIAT') {
    return getCookie('FIAT_CURRENCY') || '';
  }
  if (currencyType === 'CRYPTO') {
    return getCookie('CURRENCY') || '';
  }
  return '';
};

export default getCurrentCurrency;
