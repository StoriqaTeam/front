// @flow

import { map, addIndex, find, propEq } from 'ramda';

type CountriesType = Array<{ Code: string, Name: string }>;

export const getIndexedCountries = (countries: CountriesType) => {
  const mapIndexed = addIndex(map);
  return mapIndexed((country, index) =>
    ({ id: index.toString(), label: country.Name }), countries);
};

export const getCountryByName = (name: string, countries: CountriesType) =>
  find(propEq('Name', name))(countries);

