// @flow

import type { SelectType } from 'types';

export type CompanyType = {
  id?: string,
  service: SelectType,
  price: number,
  currency: SelectType,
  currencyLabel: string,
  country?: SelectType,
};
