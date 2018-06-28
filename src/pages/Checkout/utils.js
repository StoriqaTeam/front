// @flow

import { add, map, find } from 'ramda';

export const addressesToSelect = deliveryAddresses =>
  map(i => {
    if (!i.address || !i.address.value) {
      return null;
    }
    return { id: i.address.value, label: i.address.value };
  }, deliveryAddresses);

export const getAddressFullByValue = (deliveryAddresses, value) => {
  const addressValue = find(
    item => item.address.value === value,
    deliveryAddresses,
  );
  return addressValue.address;
};

export const addressFullToString = (addressFull: any) => {
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

export const calcTotal = (stores: Array<any>, fieldName) => {
  let total = 0;
  // eslint-disable-next-line
  for (let i = 0; i < stores.length; i++) {
    total += stores[i][fieldName];
  }
  return total;
};
