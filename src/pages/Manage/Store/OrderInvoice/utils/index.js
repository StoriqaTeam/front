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
