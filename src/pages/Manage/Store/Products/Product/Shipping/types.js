// @flow

import type { SelectItemType } from 'types';
import type { Shipping_baseProduct as ShippingBaseProductType } from './__generated__/Shipping_baseProduct.graphql';

export type ServiceType = SelectItemType & {
  countries?: Array<SelectItemType>,
};
export type ServicesType = Array<ServiceType>;
export type ServicesInterType = Array<
  { countries: Array<SelectItemType> } & SelectItemType,
>;

export type CompanyType = {
  id?: string,
  logo: string,
  service: ServiceType,
  price: number,
  currency: SelectItemType,
  country?: SelectItemType,
};

export type CompaniesType = Array<CompanyType>;
export type CompaniesInterType = Array<
  { country: SelectItemType } & CompanyType,
>;

export type LocalShippigType = $PropertyType<
  $PropertyType<ShippingBaseProductType, 'shipping'>,
  'local',
>;
export type LocalAvailablePackagesType = $PropertyType<
  $PropertyType<ShippingBaseProductType, 'availablePackages'>,
  'local',
>;
export type PickupShippigType = $PropertyType<
  $PropertyType<ShippingBaseProductType, 'shipping'>,
  'pickup',
>;

export type InterShippigType = $PropertyType<
  $PropertyType<ShippingBaseProductType, 'shipping'>,
  'international',
>;
export type InterAvailablePackagesType = $PropertyType<
  $PropertyType<ShippingBaseProductType, 'availablePackages'>,
  'international',
>;
