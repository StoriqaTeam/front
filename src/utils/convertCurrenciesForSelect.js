// @flow

import { filter, map } from 'ramda';

export default (currencies: Array<string>) =>
  filter(
    item => item.id === 'BTC' || item.id === 'ETH' || item.id === 'STQ',
    map(item => ({ id: `${item}`, label: item }), currencies),
  );
