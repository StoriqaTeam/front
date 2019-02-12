// @flow

import type {
  CategoryType,
  CurrencyType,
  FiatCurrencyType,
  CryptoCurrencyType,
  SellerCurrencyType,
  LanguageType,
  OrderStatusesType,
  CountriesDefaultType,
  CurrencyExchangeType,
} from './index';

export type DirectoriesType = {
  categories: CategoryType,
  currencies: Array<CurrencyType>,
  fiatCurrencies: Array<FiatCurrencyType>,
  cryptoCurrencies: Array<CryptoCurrencyType>,
  sellerCurrencies: Array<SellerCurrencyType>,
  languages: Array<LanguageType>,
  orderStatuses: OrderStatusesType,
  countries: CountriesDefaultType,
  currencyExchange: CurrencyExchangeType,
};
