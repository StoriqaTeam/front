// @flow

import { find, pathOr, propEq } from 'ramda';
import { matchShape } from 'found';

type SelectedType = {
  id: string,
  label: string,
};

const fromQueryString = (match: matchShape, pathName: string) => (
  items: Array<SelectedType>,
  propName: string,
): SelectedType | null => {
  const item = pathOr(null, ['location', 'query', pathName], match);
  if (item) {
    // $FlowIgnore
    return find(propEq(propName, item))(items);
  }
  return null;
};

export default fromQueryString;
