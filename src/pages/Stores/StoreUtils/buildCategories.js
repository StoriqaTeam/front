import { isEmpty, map, pathOr } from 'ramda';

import { extractText } from 'utils';

import type { Stores_search as SearchType } from '../__generated__/Stores_search.graphql';

const buildCategories = (search: SearchType): Array<{id: string, label: string}> => {
  const rawCategories = pathOr(
    [],
    [
      'findStore',
      'pageInfo',
      'searchFilters',
      'category',
      'children',
    ],
    search,
  );
  return map(item => {
    const name = extractText(item.name);
    return {
      id: `${item.rawId}`,
      label: !isEmpty(name) ? name : '',
    };
  }, rawCategories);
}

export default buildCategories;
