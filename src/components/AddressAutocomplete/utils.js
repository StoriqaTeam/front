// @flow

import { replace } from 'ramda';

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
