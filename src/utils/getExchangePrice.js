// @flow strict

import { find, propEq } from 'ramda';

import { checkCurrencyType, getCookie, formatPrice } from 'utils';
import type { CurrencyExchangeType, AllCurrenciesType } from 'types';

export default (props: {
  price: number,
  currency: ?AllCurrenciesType,
  currencyExchange: CurrencyExchangeType,
  withSymbol?: boolean,
}): ?string => {
  const { price, currency, currencyExchange, withSymbol } = props;
  if (!currency) {
    return null;
  }
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
        }${formatPrice(ratesItem.value * price, 2)} ${
          withSymbol !== true ? actualCurrency : ''
        }`;
      }
    }

    return 'STQ';
  }
  return null;
};
