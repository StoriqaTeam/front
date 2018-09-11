// @flow

export type CountryType = {
  alpha2: string,
  alpha3: string,
  label: string,
};

export type CountriesDefaultType = {
  children: Array<{
    children: Array<CountryType>,
  }>,
};
