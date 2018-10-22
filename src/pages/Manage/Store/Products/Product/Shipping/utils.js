// @flow strict

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
  AvailablePackageType,
  ShippingCountriesType,
  ServiceType,
  InterServiceType,
} from './types';

export const convertLocalAvailablePackages = (
  localAvailablePackages: Array<AvailablePackageType>,
): Array<ServiceType> => {
  const newPackages = map(
    item => ({
      id: item.companyPackageId,
      label: item.name,
      currency: { id: item.currency, label: item.currency },
    }),
    localAvailablePackages,
  );
  return newPackages;
};

export const convertInterAvailablePackages = (
  interAvailablePackages: Array<AvailablePackageType>,
): Array<InterServiceType> => {
  const newPackages = map(item => {
    const { deliveriesTo } = item;
    return {
      id: item.companyPackageId,
      label: item.name,
      countries: deliveriesTo ? head(deliveriesTo) : null,
      currency: { id: item.currency, label: item.currency },
    };
  }, interAvailablePackages);
  return newPackages;
};

export const getServiceLogo = (params: {
  id: ?string,
  packages: Array<AvailablePackageType>,
}): string => {
  const { id, packages } = params;
  if (id == null) {
    return '';
  }
  const foundPackage = find(propEq('companyPackageId', id))(packages);
  return foundPackage ? foundPackage.logo : '';
};

export const getServiceRawId = (params: {
  id: ?string,
  packages: Array<AvailablePackageType>,
}): number => {
  const { id, packages } = params;
  if (id == null) {
    return -1;
  }
  const foundPackage = find(propEq('companyPackageId', id))(packages);
  return foundPackage ? foundPackage.companyPackageRawId : -1;
};

export const getService = (params: {
  id: string,
  packages: Array<AvailablePackageType>,
}): ?ServiceType => {
  const foundPackage = find(propEq('companyPackageId', params.id))(
    params.packages,
  );
  return foundPackage
    ? {
        id: foundPackage.companyPackageId,
        label: foundPackage.name,
        currency: { id: foundPackage.currency, label: foundPackage.currency },
      }
    : null;
};

export const getCountries = (params: {
  id: string,
  packages: Array<AvailablePackageType>,
}) => {
  const foundPackage = find(propEq('companyPackageId', params.id))(
    params.packages,
  );
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

export const convertCountriesToArrCodes = (params: {
  countries: ?ShippingCountriesType,
  isSelectedAll?: boolean,
}): Array<string> => {
  const { countries, isSelectedAll } = params;
  if (!countries) {
    return [];
  }
  const newCountries = flatten(
    map(
      item =>
        map(
          child => child.alpha3,
          filter(
            child => child.isSelected === true || Boolean(isSelectedAll),
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

export const convertCountriesToArrLabels = (
  countries: ?ShippingCountriesType,
): Array<string> => {
  if (!countries) {
    return [];
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
  return newCountries;
};
