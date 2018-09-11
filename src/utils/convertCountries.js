// @flow

import { forEach, append, flatten } from 'ramda';

import type { CountriesDefaultTypes, SelectItemType } from 'types';

export default (countries: CountriesDefaultTypes): Array<SelectItemType> => {
  let newCountries = [];
  forEach(item => {
    newCountries = append(item.children, newCountries);
  }, countries.children);
  return flatten(newCountries);
};
