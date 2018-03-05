// @flow

import { replace } from 'ramda';

export const getScriptURL = () => {
  // const urlTemplate = process.env.REACT_APP_GOOGLE_PLACES_API_URL;
  // const keyPlaceholder = process.env.REACT_APP_GOOGLE_PLACES_API_KEY_PLACEHOLDER;
  // const apiKey = process.env.REACT_APP_GOOGLE_PLACES_API_KEY;
  const urlTemplate = 'https://maps.googleapis.com/maps/api/js?key=#API_KEY#&libraries=places';
  const keyPlaceholder = '#API_KEY#';
  const apiKey = 'AIzaSyDZFEQohOpK4QNELXiXw50DawOyoSgovTs';
  return replace(keyPlaceholder, apiKey, urlTemplate);
};

// const geocodeByAddress = (address) => {
//   /* eslint-disable */
//   const geocoder = new google.maps.Geocoder();
//   const { OK } = google.maps.GeocoderStatus;
//   /* eslint-enable */
//
//   return new Promise((resolve, reject) => {
//     geocoder.geocode({ address }, (results, status) => {
//       if (status !== OK) {
//         reject(status);
//       }
//
//       resolve(results);
//     });
//   });
// };

// export default { geocodeByAddress };
