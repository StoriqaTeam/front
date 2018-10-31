// @flow

import type {
  CategoryType,
  CurrencyType,
  LanguageType,
  OrderStatusesType,
  CountriesDefaultType,
} from './index';

export type DirectoriesType = {
  categories: CategoryType,
  currencies: Array<CurrencyType>,
  languages: Array<LanguageType>,
  orderStatuses: OrderStatusesType,
  countries: CountriesDefaultType,
};
