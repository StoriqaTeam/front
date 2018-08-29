// @flow

import Cookies from 'universal-cookie';

const currentCurrency = () => {
  const cookies = new Cookies();
  return cookies.get('CURRENCY') || 'STQ';
};

export default currentCurrency;
