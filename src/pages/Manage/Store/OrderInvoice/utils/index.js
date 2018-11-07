// @flow strict

import { isNil, pick, isEmpty } from 'ramda';

export const formatStatus = (str: string): string =>
  str.replace(/[\W_]+/g, ' ').toLowerCase();

type OrderType = ?{
  +receiverName: string,
  +slug: number,
  +trackId: ?string,
  +state: string,
};

export const pluckFromOrder = (odr: OrderType) => (props: Array<string>) => {
  const order = !isNil(odr) ? { ...odr } : {};
  if (isEmpty(order)) {
    return order;
  }
  return pick(props, order);
};

export const setRegion = (admin1: ?string, admin2: ?string): string => {
  let administrativeAreaLevel = '';
  if (!isNil(admin1) && !isNil(admin2)) {
    administrativeAreaLevel = `${admin1}, ${admin2}`;
  }
  if (!isNil(admin1) && isNil(admin2)) {
    administrativeAreaLevel = admin1;
  }
  if (isNil(admin1) && !isNil(admin2)) {
    administrativeAreaLevel = admin2;
  }
  return administrativeAreaLevel;
};
