// @flow

import type { SelectItemType } from 'types';

export type CountryType = {
  parent: string,
  alpha3: string,
  alpha2: string,
  label: string,
  isSelected?: boolean,
};

export type ShippingCountriesType = {
  children: Array<{
    alpha3: string,
    label: string,
    children: Array<CountryType>,
    isOpen?: boolean,
    isSelected?: boolean,
  }>,
  isSelected?: boolean,
};

export type ServiceType = {
  id: string,
  label: string,
  countries?: ?ShippingCountriesType,
};

export type InterServiceType = {
  id: string,
  label: string,
  countries: ?ShippingCountriesType,
};

export type CompanyType = {
  id?: string,
  logo?: string,
  service: ?ServiceType,
  price: ?number,
  currency: SelectItemType,
  countries?: ShippingCountriesType,
};

export type FilledCompanyType = {
  id: string,
  companyPackageRawId: number,
  logo: string,
  service: ?ServiceType,
  price: ?number,
  currency: SelectItemType,
  countries?: ?ShippingCountriesType,
};

export type ShippingType = {
  companyPackageId: string,
  price: ?number,
  deliveriesTo?: Array<ShippingCountriesType>,
};

export type RequestLocalShippingType = {
  companyPackageId: number,
  price?: ?number,
};

export type RequestInterShippingType = {
  companyPackageId: number,
  price?: ?number,
  deliveriesTo: $ReadOnlyArray<string>,
};

export type AvailablePackagesType = {
  companyPackageId: string,
  companyPackageRawId: number,
  name: string,
  logo: string,
  deliveriesTo?: Array<ShippingCountriesType>,
};

export type PickupShippingType = {
  price: ?number,
  pickup: boolean,
};

export type InterAvailablePackagesType = {
  companyPackageId: string,
  companyPackageRawId: number,
  name: string,
  logo: string,
  deliveriesTo: Array<ShippingCountriesType>,
};

export type ShippingChangeDataType = {
  companies?: Array<FilledCompanyType>,
  inter?: boolean,
  pickup?: PickupShippingType,
  withoutInter?: boolean,
  withoutLocal?: boolean,
};
