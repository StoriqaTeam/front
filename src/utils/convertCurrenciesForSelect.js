// @flow

import { filter, map } from 'ramda';

import type { CurrenciesType } from 'types';

export default (currencies: CurrenciesType) =>
  filter(
    item =>
      item.label === 'BTC' || item.label === 'ETH' || item.label === 'STQ',
    map(item => ({ id: `${item.key}`, label: item.code }), currencies),
  );
