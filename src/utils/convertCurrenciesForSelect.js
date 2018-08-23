// @flow

import { filter, map } from 'ramda';

export default (
  currencies: Array<{ key: number, name: string, alias: string }>,
) =>
  filter(
    item =>
      item.label === 'BTC' || item.label === 'ETH' || item.label === 'STQ',
    map(item => ({ id: `${item.key}`, label: item.alias }), currencies),
  );
