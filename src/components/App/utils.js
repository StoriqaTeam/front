// @flow

import { map, addIndex, find, propEq } from 'ramda';

type CountriesType = Array<{ Code: string, Name: string }>;

export const getIndexedCountries = (countries: CountriesType) => {
  const mapIndexed = addIndex(map);
  return mapIndexed((country, index) =>
    ({ id: index.toString(), label: country.Name }), countries);
};

export const getCountryByName = (name: string, countries: CountriesType) =>
  find(propEq('Name', name))(countries);

// export const codeLatLng = (lat, lng) => {
//   let latlng = new google.maps.LatLng(lat, lng);
//   geocoder.geocode({ 'latLng': latlng }, function (results, status) {
//     if (status == google.maps.GeocoderStatus.OK) {
//       //console.log(results);
//       if (results[1]) {
//         var indice = 0;
//         for (var j = 0; j < results.length; j++) {
//           if (results[j].types[0] == 'locality') {
//             indice = j;
//             break;
//           }
//         }
//         alert('The good number is: ' + j);
//         console.log(results[j]);
//         for (var i = 0; i < results[j].address_components.length; i++) {
//           if (results[j].address_components[i].types[0] == "locality") {
//             //this is the object you are looking for
//             city = results[j].address_components[i];
//           }
//           if (results[j].address_components[i].types[0] == "administrative_area_level_1") {
//             //this is the object you are looking for
//             region = results[j].address_components[i];
//           }
//           if (results[j].address_components[i].types[0] == "country") {
//             //this is the object you are looking for
//             country = results[j].address_components[i];
//           }
//         }

//         //city data
//         alert(city.long_name + " || " + region.long_name + " || " + country.short_name)


//       } else {
//         alert("No results found");
//       }
//       //}
//     } else {
//       alert("Geocoder failed due to: " + status);
//     }
//   });
// } 