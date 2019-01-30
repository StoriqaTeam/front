// @flow strict

import { getCookie } from 'utils';

import { COOKIE_CURRENCY, COOKIE_FIAT_CURRENCY } from 'constants';

const getCurrentCurrency = (currencyType?: ?'FIAT' | ?'CRYPTO') => {
  if (currencyType === 'FIAT') {
    return getCookie(COOKIE_FIAT_CURRENCY) || '';
  }
  if (currencyType === 'CRYPTO') {
    return getCookie(COOKIE_CURRENCY) || '';
  }
  return '';
};

export default getCurrentCurrency;
