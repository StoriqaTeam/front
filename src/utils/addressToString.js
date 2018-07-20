// @flow

import { filter, join } from 'ramda';

export default (addressFull: {
  value: ?string,
  country: ?string,
  administrativeAreaLevel1: ?string,
  administrativeAreaLevel2: ?string,
  locality: ?string,
  political: ?string,
  postalCode: ?string,
  route: ?string,
  streetNumber: ?string,
  placeId: ?string,
}) => {
  const {
    // value,
    country,
    // administrativeAreaLevel1,
    // administrativeAreaLevel2,
    locality,
    // political,
    postalCode,
    route,
    streetNumber,
    // placeId,
  } = addressFull;
  const addressArr = [country, locality, route, streetNumber, postalCode];
  const filteredAddressArr = filter(item => Boolean(item), addressArr);
  const address = join(', ', filteredAddressArr);
  join(', ', []);
  return address || null;
};
