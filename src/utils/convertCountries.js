// @flow

import { forEach, append, flatten, sort } from 'ramda';

import type { CountriesDefaultType } from 'types';

export default (countries: CountriesDefaultType) => {
  let newCountries = [];
  forEach(item => {
    newCountries = append(item.children, newCountries);
  }, countries.children);
  newCountries = sort(
    // $FlowIgnore
    (a, b) => (a.label < b.label ? -1 : 1),
    flatten(newCountries),
  );
  return newCountries;
};
