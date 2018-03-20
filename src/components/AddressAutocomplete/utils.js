// @flow

import { replace, map, addIndex, find, propEq } from 'ramda';


type CountriesType = Array<{ Code: string, Name: string }>;

export const getIndexedCountries = (countries: CountriesType) => {
  const mapIndexed = addIndex(map);
  return mapIndexed((country, index) =>
    ({ id: index.toString(), label: country.Name }), countries);
};

export const getCountryByName = (name: string, countries: CountriesType) =>
  find(propEq('Name', name))(countries);

export const getScriptURL = () => {
  // workaround for storybook
  if (!process.env.REACT_APP_GOOGLE_PLACES_API_URL) {
    return 'https://maps.googleapis.com/maps/api/js?key=AIzaSyDZFEQohOpK4QNELXiXw50DawOyoSgovTs&libraries=places';
  }

  const urlTemplate = process.env.REACT_APP_GOOGLE_PLACES_API_URL;
  const keyPlaceholder = process.env.REACT_APP_GOOGLE_PLACES_API_KEY_PLACEHOLDER;
  const apiKey = process.env.REACT_APP_GOOGLE_PLACES_API_KEY;
  return replace(keyPlaceholder, apiKey, urlTemplate);
};

