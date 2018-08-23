// @flow

import { addIndex, has, map, pathOr } from 'ramda';

import { extractText } from 'utils';

import type { Stores_search as SearchType } from '../__generated__/Stores_search.graphql';

const fromSearchFilters = (
  search: SearchType,
  pathNames: Array<string>,
): Array<{ id: string, label: string }> => {
  // $FlowIgnore
  const rawFiltered = pathOr(
    [],
    ['findStore', 'pageInfo', 'searchFilters', ...pathNames],
    search,
  );
  const mapIndexed = addIndex(map);
  return mapIndexed(
    (item, idx) => ({
      id: `${has('rawId')(item) ? item.rawId : idx}`,
      label: has('name')(item) ? extractText(item.name) : item,
    }),
    rawFiltered,
  );
};

export default fromSearchFilters;
