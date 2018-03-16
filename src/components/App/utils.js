// @flow

import { map, addIndex, find, propEq } from 'ramda';


export const getIndexedCountries = (countries) => {
  const mapIndexed = addIndex(map);
  return mapIndexed((country, index) =>
    ({ id: index.toString(), label: country.Name }), countries);
};

export const getCountryByName = (name, countries) =>
  find(propEq('Name', name))(countries);

