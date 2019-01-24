// @flow strict

import { find, propEq } from 'ramda';

import { checkCurrencyType, getCookie, formatPrice } from 'utils';
import type { CurrencyExchangeType } from 'types';

export default (props: {
  price: number,
  currency: 'STQ' | 'ETH' | 'BTC' | 'USD' | 'EUR',
  currencyExchange: CurrencyExchangeType,
  withSymbol: boolean,
}): ?string => {
  const { price, currency, currencyExchange, withSymbol } = props;
  const currencyType = checkCurrencyType(currency);

  if (currencyType === 'crypto') {
    const actualCurrency = getCookie('FIAT_CURRENCY');
    const currencyExchangeItem = find(propEq('code', actualCurrency))(
      currencyExchange,
    );

    if (currencyExchangeItem) {
      const ratesItem = find(propEq('code', currency))(
        currencyExchangeItem.rates,
      );
      if (ratesItem) {
        let actualCurrencySymbol = '';
        if (actualCurrency === 'USD') {
          actualCurrencySymbol = '$';
        }
        if (actualCurrency === 'EUR') {
          actualCurrencySymbol = '€';
        }
        return `~${
          withSymbol === true ? actualCurrencySymbol : ''
        }${formatPrice(ratesItem.value * price)} ${
          withSymbol !== true ? actualCurrency : ''
        }`;
      }
    }

    return 'STQ';
  }
  return null;
};
