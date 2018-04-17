// @flow

import { curry, isNil, map, reduce, find, filter, whereEq, keys, pipe, split, complement, assoc, assocPath, pathOr, evolve, omit } from 'ramda';

const byLang = (lang: string) => find(whereEq({ lang }));

type NameType = {
  lang: string,
  text: string,
}

export const getNameText = (arr: Array<NameType>, lang: string) => {
  let name = byLang(lang)(arr);
  if (!name || !name.text) name = byLang('EN')(arr);
  return name ? name.text : null;
};

export const flattenFunc = reduce((acc, nextItem) => {
  if (nextItem.children) {
    return [
      ...acc,
      nextItem,
      ...flattenFunc(nextItem.children),
    ];
  }
  return [
    ...acc,
    nextItem,
  ];
}, []);

const urlToAttr = (item) => {
  const left = item.split('=').length === 2 ? item.split('=')[0] : null;
  const right = item.split('=').length === 2 ? item.split('=')[1] : null;
  if (!left || !right) return null;
  const methodName = left.split('.').length === 2 ? left.split('.')[0] : null;
  const id = left.split('.').length === 2 ? parseInt(left.split('.')[1], 10) : null;
  if (!methodName || !id) return null;
  return {
    id,
    [methodName]: {
      values: right.split(','),
    },
  };
};

const parseAttrFiltersFromUrl = pipe(
  split(';'),
  map(urlToAttr),
  filter(complement(isNil)),
);

const renameKeys = curry((keysMap, obj) =>
  reduce((acc, key) => assoc(keysMap[key] || key, obj[key], acc), {}, keys(obj)));

export const prepareGetUrl = (queryObj: {}) => {
  // const search = pathOr('', ['search'], queryObj);
  const categoryId = pathOr(null, ['category'], queryObj);
  return pipe(
    renameKeys({ search: 'name' }),
    omit(['category']),
    i => (categoryId ? assocPath(['options', 'categoryId'], parseInt(categoryId, 10), i) : i),
  )(queryObj);
};

// export const prepareGetUrl = (queryObj: {}) => reduce((acc, next) => {
//   switch (next) {
//     case 'search':
//       return { ...acc, name: queryObj[next] };
//     case 'category':
//       return { ...acc, categoryId: parseInt(queryObj[next], 10) || 1 };
//     case 'minValue':
//       return {
//         ...acc,
//         options: {
//           ...acc.options,
//           priceFilter: {
//             ...acc.options.priceFilter,
//             minValue: parseInt(queryObj[next], 10) || 0,
//           },
//         },
//       };
//     case 'maxValue':
//       return {
//         ...acc,
//         options: {
//           ...acc.options,
//           priceFilter: {
//             ...acc.options.priceFilter,
//             maxValue: parseInt(queryObj[next], 10) || 0,
//           },
//         },
//       };
//     case 'attrFilters':
//       return {
//         ...acc,
//         attrFilters: parseAttrFiltersFromUrl(queryObj[next]),
//       };
//     default:
//       return acc;
//   }
// }, {}, keys(queryObj));

type ChildrenType = {
  parentId: number,
  rawId: number,
  name: Array<{ text: string, lang: string }>,
}

const searchPathByParent = (
  arr: Array<ChildrenType>,
  rawId: number,
  stack: Array<ChildrenType> = [],
) => {
  const result = find(whereEq({ rawId }))(arr);
  stack.unshift(result);
  if (result.parentId) {
    searchPathByParent(arr, result.parentId, stack);
  }
  return stack;
};

export default searchPathByParent;
