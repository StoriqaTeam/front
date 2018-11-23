// @flow

import { forEach, append, flatten, sort } from 'ramda';

import type { CountriesDefaultType } from 'types';

export type CountryType = {
  alpha2: string,
  alpha3: string,
  label: string,
};

export default (countries: CountriesDefaultType): Array<CountryType> => {
  let newCountries = [];
  forEach(item => {
    // $FlowIgnore
    newCountries = append(item.children, newCountries);
  }, countries.children);
  newCountries = sort(
    // $FlowIgnore
    (a, b) => (a.label < b.label ? -1 : 1),
    flatten(newCountries),
  );
  // $FlowIgnore
  return newCountries;
};
