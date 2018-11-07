// @flow strict

import { addressToString } from 'utils';

import { map } from 'ramda';

import type { AddressFullType } from 'types';

export const addressesToSelect = (
  deliveryAddresses: Array<{
    id: string,
    address: AddressFullType,
    isPriority: boolean,
  }>,
) =>
  map(
    item => ({
      id: item.isPriority ? '0' : item.id,
      label: addressToString(item.address),
    }),
    deliveryAddresses,
  );
