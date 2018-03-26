// @flow

import { curry, pipe, map, adjust, fromPairs, toPairs } from 'ramda';

export default curry((fn, obj) => pipe(toPairs, map(adjust(fn, 0)), fromPairs)(obj));
