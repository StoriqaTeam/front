// @flow

import { filter, join } from 'ramda';

import type { AddressFullType } from 'types';

export default (addressFull: AddressFullType): string => {
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
  return address || '';
};
