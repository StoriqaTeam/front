// @flow

import { map, clone, find, propEq } from 'ramda';
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
    return { id: item.name, label: item.name, countries: deliveriesTo };
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
