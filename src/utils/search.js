// @flow

import { reduce, find, whereEq, keys } from 'ramda';

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

export const prepareGetUrl = (queryObj: {}) => reduce((acc, next) => {
  switch (next) {
    case 'search':
      return { ...acc, name: queryObj[next] };
    case 'category':
      return { ...acc, categoryId: parseInt(queryObj[next], 10) || 1 };
    case 'minValue':
      return {
        ...acc,
        priceRange: {
          ...acc.priceRange,
          minValue: parseInt(queryObj[next], 10) || 0,
        },
      };
    case 'maxValue':
      return {
        ...acc,
        priceRange: {
          ...acc.priceRange,
          maxValue: parseInt(queryObj[next], 10) || 0,
        },
      };
    default:
      return { ...acc, [next]: queryObj[next] };
  }
}, {}, keys(queryObj));


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
