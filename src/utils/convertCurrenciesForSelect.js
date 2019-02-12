// @flow strict

import { map } from 'ramda';

export default (currencies: Array<string>) =>
  map(item => ({ id: `${item}`, label: item }), currencies);
