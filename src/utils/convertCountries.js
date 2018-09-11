// @flow

import { forEach, append, flatten } from 'ramda';

import type { CountriesDefaultType } from 'types';

export default (countries: CountriesDefaultType) => {
  let newCountries = [];
  forEach(item => {
    newCountries = append(item.children, newCountries);
  }, countries.children);
  // $FlowIgnore
  return flatten(newCountries);
};
