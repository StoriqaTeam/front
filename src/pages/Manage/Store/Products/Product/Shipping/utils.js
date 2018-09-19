// @flow

import {
  map,
  find,
  propEq,
  head,
  flatten,
  filter,
  join,
  contains,
} from 'ramda';

import type {
  AvailablePackagesType,
  ShippingCountriesType,
  ServiceType,
  InterServiceType,
} from './types';

export const convertLocalAvailablePackages = (
  localAvailablePackages: Array<AvailablePackagesType>,
): Array<ServiceType> => {
  const newPackages = map(
    item => ({ id: item.name, label: item.name }),
    localAvailablePackages,
  );
  return newPackages;
};

export const convertInterAvailablePackages = (
  interAvailablePackages: Array<AvailablePackagesType>,
): Array<InterServiceType> => {
  const newPackages = map(item => {
    const { deliveriesTo } = item;
    return {
      id: item.name,
      label: item.name,
      countries: deliveriesTo ? head(deliveriesTo) : null,
    };
  }, interAvailablePackages);
  return newPackages;
};

export const getServiceLogo = (
  id: ?string,
  availablePackages: Array<AvailablePackagesType>,
): string => {
  if (!id) {
    return '';
  }
  const foundPackage = find(propEq('name', id))(availablePackages);
  return foundPackage ? foundPackage.logo : '';
};

export const getServiceRawId = (
  id: ?string,
  availablePackages: Array<AvailablePackagesType>,
): number => {
  if (!id) {
    return -1;
  }
  const foundPackage = find(propEq('name', id))(availablePackages);
  return foundPackage ? foundPackage.companyPackageRawId : -1;
};

export const getService = (
  id: string,
  availablePackages: Array<AvailablePackagesType>,
): ?ServiceType => {
  const foundPackage = find(propEq('companyPackageId', id))(availablePackages);
  return foundPackage
    ? { id: foundPackage.name, label: foundPackage.name }
    : null;
};

export const getCountries = (
  id: string,
  availablePackages: Array<AvailablePackagesType>,
) => {
  const foundPackage = find(propEq('companyPackageId', id))(availablePackages);
  return foundPackage && foundPackage.deliveriesTo
    ? head(foundPackage.deliveriesTo)
    : null;
};

export const convertCountriesForSelect = (params: {
  countries: ?ShippingCountriesType,
  isSelected?: boolean,
  checkedCountries?: Array<string>,
}): ?ShippingCountriesType => {
  const { countries, isSelected, checkedCountries } = params;
  if (countries) {
    let isSelectedAll = true;
    const newChildren = map(continent => {
      let isSelectedContinent = false;
      const children = map(country => {
        const isSelectedCountry = checkedCountries
          ? contains(country.alpha3, checkedCountries)
          : false;
        if (isSelectedCountry) {
          isSelectedContinent = true;
        } else {
          isSelectedAll = false;
        }
        return {
          ...country,
          isSelected: isSelected !== undefined ? isSelected : isSelectedCountry,
        };
      }, continent.children);
      return {
        ...continent,
        children,
        isSelected: isSelected !== undefined ? isSelected : isSelectedContinent,
      };
    }, countries.children);
    return {
      ...countries,
      children: newChildren,
      isSelected: isSelected !== undefined ? isSelected : isSelectedAll,
    };
  }
  return null;
};

export const convertCountriesToArrCodes = (
  countries: ?ShippingCountriesType,
  isSelectedAll?: boolean,
): Array<string> => {
  if (!countries) {
    return [];
  }
  const newCountries = flatten(
    map(
      item =>
        map(
          child => child.alpha3,
          filter(
            child => child.isSelected || Boolean(isSelectedAll),
            item.children,
          ),
        ),
      countries.children,
    ),
  );
  return newCountries;
};

export const convertCountriesToStringLabels = (
  countries: ?ShippingCountriesType,
): string => {
  if (!countries) {
    return '';
  }
  const newCountries = flatten(
    map(
      item =>
        map(
          child => child.label,
          filter(child => Boolean(child.isSelected), item.children),
        ),
      countries.children,
    ),
  );
  return join(', ', newCountries);
};
