// @flow

import { map } from 'ramda';

import { convertCountries } from 'utils';

import type { CountriesDefaultType } from 'types';

export default (
  countries: CountriesDefaultType,
  alphaType: 'alpha2' | 'alpha3',
) =>
  map(
    item => ({ id: item[alphaType], label: item.label }),
    convertCountries(countries),
  );
