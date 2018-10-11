// @flow

import { replace, find, propEq, addIndex, map } from 'ramda';

import type { CountriesType } from 'types';

export const getIndexedCountries = (countries: CountriesType) => {
  const mapIndexed = addIndex(map);
  return mapIndexed(
    country => ({ id: country.alpha3, label: country.label }),
    countries,
  );
};

export const getCountryByName = (label: string, countries: CountriesType) =>
  find(propEq('label', label))(countries);

export const getScriptURL = () => {
  // workaround for storybook
  if (!process.env.REACT_APP_GOOGLE_PLACES_API_URL) {
    return 'https://maps.googleapis.com/maps/api/js?key=AIzaSyDZFEQohOpK4QNELXiXw50DawOyoSgovTs&libraries=places';
  }

  const urlTemplate = process.env.REACT_APP_GOOGLE_PLACES_API_URL || '';
  const keyPlaceholder =
    process.env.REACT_APP_GOOGLE_PLACES_API_KEY_PLACEHOLDER || '';
  const apiKey = process.env.REACT_APP_GOOGLE_PLACES_API_KEY || '';

  return replace(keyPlaceholder, apiKey, urlTemplate);
};
