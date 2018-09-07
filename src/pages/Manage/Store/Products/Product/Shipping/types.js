// @flow

import type { SelectItemType } from 'types';

export type ServiceType = SelectItemType & {
  countries?: Array<SelectItemType>,
};
export type ServicesType = Array<ServiceType>;
export type ServicesInterType = Array<
  { countries: Array<SelectItemType> } & SelectItemType,
>;

export type CompanyType = {
  id?: string,
  img?: string,
  service: SelectItemType,
  price: number,
  currency: SelectItemType,
} & { country?: SelectItemType };

export type CompaniesType = Array<CompanyType>;
export type CompaniesInterType = Array<
  { country: SelectItemType } & CompanyType,
>;
