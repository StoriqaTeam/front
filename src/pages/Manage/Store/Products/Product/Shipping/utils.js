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
} from 'ramda';
import type {
  ServicesType,
  CompanyType,
  LocalShippigType,
  PickupShippigType,
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

  // const packages = [ ...interAvailablePackages ];
  // const newPackages = map(item => {
  //   const deliveriesTo = [...item.deliveriesTo];
  //   const countries = map(country => ({ id: country.alpha3, label: country.label }), deliveriesTo);
  //   return ({ id: item.name, label: item.name, countries });
  // }, packages);
  // return newPackages;
};

export const getServiceLogo = (
  id: string,
  localAvailablePackages: LocalAvailablePackagesType,
) => {
  const packages = [...localAvailablePackages];
  const foundPackage = find(propEq('name', id))(packages);
  return foundPackage ? foundPackage.logo : null;
};

export const convertCountriesForSelect = (params: {
  countries: any,
  isChecked?: boolean,
}) => {
  const newChildren = map(
    item => ({
      alpha3: item.alpha3,
      label: item.label,
      isOpen: params.isChecked !== undefined ? item.isOpen : false,
      isChecked: params.isChecked || false,
      children: map(
        child => ({
          parent: child.parent,
          alpha3: child.alpha3,
          label: child.label,
          isChecked: params.isChecked || false,
        }),
        item.children,
      ),
    }),
    params.countries.children,
  );
  return {
    ...params.countries,
    isChecked: params.isChecked || false,
    children: newChildren,
  };
};

export const convertCountriesForResponse = (countries: any, isAll: boolean) => {
  console.log('---countries', countries);
  const headCountries = head(countries);
  // $FlowIgnore
  const newCountries = flatten(
    map(
      item =>
        map(
          child => child.alpha3,
          filter(child => isAll || child.isChecked, item.children),
        ),
      headCountries,
    ),
  );
  console.log('---newCountries', newCountries);
  return newCountries;
};
