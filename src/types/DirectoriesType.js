// @flow
import type {
  CategoryType,
  CurrencyType,
  LanguageType,
  OrderStatusesType,
} from './index';

export type DirectoriesType = {
  categories: CategoryType,
  currencies: Array<CurrencyType>,
  languages: Array<LanguageType>,
  orderStatuses: OrderStatusesType,
};
