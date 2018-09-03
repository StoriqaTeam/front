// @flow

import { filter, map } from 'ramda';

import type { CurrenciesType } from 'types';

export default (currencies: CurrenciesType) =>
  filter(
    item => item.id === 'BTC' || item.id === 'ETH' || item.id === 'STQ',
    map(item => ({ id: `${item}`, label: item }), currencies),
  );
