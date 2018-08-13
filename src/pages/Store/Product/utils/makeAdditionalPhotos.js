// @flow

import { addIndex, map } from 'ramda';

import type { WidgetOptionType } from '../types';

const indexMap = addIndex(map);

export const makeWidgetsFromVariants = (
  photos: Array<string>,
): Array<WidgetOptionType> =>
  photos
    ? indexMap((val, idx) => ({ label: `${idx + 1}`, image: val }), photos)
    : [];

export default makeWidgetsFromVariants;
