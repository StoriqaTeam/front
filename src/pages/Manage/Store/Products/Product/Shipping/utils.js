// @flow

import {
  map,
  clone,
  find,
  propEq,
  head,
  forEach,
  append,
  flatten,
  filter,
  join,
  isEmpty,
  contains,
} from 'ramda';
import type {
  ServicesType,
  CompanyType,
  LocalShippingType,
  PickupShippingType,
  LocalAvailablePackagesType,
  InterAvailablePackagesType,
} from './types';

export const convertLocalAvailablePackages = (
  localAvailablePackages: LocalAvailablePackagesType,
) => {
  const packages = [...localAvailablePackages];
  const newPackages = map(
    item => ({ id: item.name, label: item.name }),
    packages,
  );
  return newPackages;
};

export const convertInterAvailablePackages = (
  interAvailablePackages: InterAvailablePackagesType,
) => {
  const packages = [...interAvailablePackages];
  const newPackages = map(item => {
    const deliveriesTo = [...item.deliveriesTo];
    return { id: item.name, label: item.name, countries: head(deliveriesTo) };
  }, packages);
  return newPackages;
};

export const getServiceLogo = (
  id: string,
  availablePackages: LocalAvailablePackagesType | InterAvailablePackagesType,
) => {
  const packages = Array(...availablePackages);
  const foundPackage = find(propEq('name', id))(packages);
  return foundPackage ? foundPackage.logo : null;
};

export const getServiceRawId = (
  id: string,
  availablePackages: LocalAvailablePackagesType | InterAvailablePackagesType,
) => {
  const packages = Array(...availablePackages);
  const foundPackage = find(propEq('name', id))(packages);
  return foundPackage ? foundPackage.companyPackageRawId : null;
};

export const getService = (
  id: string,
  availablePackages: LocalAvailablePackagesType | InterAvailablePackagesType,
) => {
  const packages = Array(...availablePackages);
  const foundPackage = find(propEq('companyPackageId', id))(packages);
  return foundPackage
    ? { id: foundPackage.name, label: foundPackage.name }
    : null;
};

export const getCountries = (
  id: string,
  availablePackages: InterAvailablePackagesType,
) => {
  const packages = Array(...availablePackages);
  const foundPackage = find(propEq('companyPackageId', id))(packages);
  return foundPackage ? head(foundPackage.deliveriesTo) : null;
};

export const convertCountriesForSelect = (params: {
  countries: any,
  isChecked?: boolean,
  checkedCountries?: Array<string>,
}) => {
  const { countries, isChecked, checkedCountries } = params;
  if (countries) {
    let isCheckedAll = true;
    const newChildren = map(continent => {
      let isCheckedContinent = false;
      const children = map(country => {
        const isCheckedCountry = checkedCountries
          ? contains(country.alpha3, checkedCountries)
          : false;
        if (isCheckedCountry) {
          isCheckedContinent = true;
        } else {
          isCheckedAll = false;
        }
        return {
          ...country,
          isChecked: isChecked !== undefined ? isChecked : isCheckedCountry,
        };
      }, continent.children);
      return {
        ...continent,
        children,
        isChecked: isChecked !== undefined ? isChecked : isCheckedContinent,
      };
    }, countries.children);
    return {
      ...countries,
      children: newChildren,
      isChecked: isChecked !== undefined ? isChecked : isCheckedAll,
    };
  }
  return [];
};

export const convertCountriesToArrCodes = (
  countries: any,
  isCheckedAll?: boolean,
) => {
  if (!isEmpty(countries)) {
    const newCountries = flatten(
      map(
        item =>
          map(
            child => child.alpha3,
            filter(child => child.isChecked || isCheckedAll, item.children),
          ),
        countries.children,
      ),
    );
    return newCountries;
  }
  return [];
};

export const convertCountriesToStringLabels = (countries: any) => {
  if (!countries || isEmpty(countries)) {
    return [];
  }
  const newCountries = flatten(
    map(
      item =>
        map(
          child => child.label,
          filter(child => child.isChecked, item.children),
        ),
      countries.children,
    ),
  );
  return join(', ', newCountries);
};
