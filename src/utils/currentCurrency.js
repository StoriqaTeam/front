// @flow strict

import Cookies from 'universal-cookie';
import { getCookie } from 'utils';

const currentCurrency = (currencyType?: 'FIAT' | 'CRYPTO') => {
  if (!currencyType) {
    const cookies = new Cookies();
    return cookies.get('CURRENCY') || 'STQ';
  }
  if (currencyType === 'FIAT') {
    return getCookie('FIAT_CURRENCY');
  }
  if (currencyType === 'CRYPTO') {
    return getCookie('CURRENCY');
  }
  return '';
};

export default currentCurrency;
