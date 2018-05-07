// @flow

import { replace, map, addIndex, find, propEq } from 'ramda';

type CountriesType = Array<{ code: string, name: string }>;

export const getIndexedCountries = (countries: CountriesType) => {
  const mapIndexed = addIndex(map);
  return mapIndexed(
    country => ({ id: country.code, label: country.name }),
    countries,
  );
};

export const getCountryByName = (name: string, countries: CountriesType) =>
  find(propEq('name', name))(countries);

export const getScriptURL = () => {
  // workaround for storybook
  if (!process.env.REACT_APP_GOOGLE_PLACES_API_URL) {
    return 'https://maps.googleapis.com/maps/api/js?key=AIzaSyDZFEQohOpK4QNELXiXw50DawOyoSgovTs&libraries=places';
  }

  const urlTemplate = process.env.REACT_APP_GOOGLE_PLACES_API_URL;
  const keyPlaceholder =
    process.env.REACT_APP_GOOGLE_PLACES_API_KEY_PLACEHOLDER;
  const apiKey = process.env.REACT_APP_GOOGLE_PLACES_API_KEY;
  return replace(keyPlaceholder, apiKey, urlTemplate);
};
