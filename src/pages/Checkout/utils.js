// @flow

import { addressToString } from 'utils';

import { map, addIndex } from 'ramda';

import type { AddressFullType } from 'components/AddressAutocomplete/AddressForm';

export const addressesToSelect = (deliveryAddresses: any) =>
  addIndex(map)(
    (item, idx) => ({
      id: `${idx}`,
      label: addressToString(item.address),
    }),
    deliveryAddresses,
  );

export const addressFullToString = (addressFull: AddressFullType) => {
  if (
    !addressFull ||
    !addressFull.country ||
    !addressFull.locality ||
    !addressFull.value
  ) {
    return 'no address';
  }
  return `${addressFull.country}, ${addressFull.locality}, ${
    addressFull.value
  }`;
};

export const calcTotal = (stores: any, fieldName: string) => {
  let total = 0;
  // eslint-disable-next-line
  for (let i = 0; i < stores.length; i++) {
    total += stores[i][fieldName];
  }
  return total;
};
