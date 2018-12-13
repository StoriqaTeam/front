// @flow strict

import { matchShape } from 'found';
import { filter, keys, map, assoc, isEmpty } from 'ramda';

export default (
  query: matchShape,
): { referal?: number, utmMarks?: Array<{ key: string, value: string }> } => {
  let result = {};
  const referal = query.ref ? parseFloat(query.ref) : null;
  if (referal) {
    result = assoc('referal', referal, result);
  }

  const utmKeys = filter(item => item.substr(0, 4) === 'utm_', keys(query));
  if (!isEmpty(utmKeys)) {
    const utmMarks = map(item => ({ key: item, value: query[item] }), utmKeys);
    result = assoc('utmMarks', utmMarks, result);
  }
  return result;
};
