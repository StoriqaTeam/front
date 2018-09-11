// @flow

export type CountryType = {
  alpha2: string,
  alpha3: string,
  label: string,
};

export type CountriesType = Array<CountryType>;

export type CountriesDefaultType = {
  children: Array<{
    children: CountriesType,
  }>,
};
