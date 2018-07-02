import { find, pathOr, propEq } from 'ramda';
import { matchShape } from 'found';

import { buildCategories } from './index';

import type { Stores_search as SearchType } from '../__generated__/Stores_search.graphql';

const buildCategory = (search: SearchType, match: matchShape): string | null => {
  const categories = buildCategories(search);
  const category = pathOr(
    null,
    ['location', 'query', 'category'],
    match,
  );
  if (category) {
    return find(propEq('id', category))(categories)
  }
  return null;
}

export default buildCategory;
