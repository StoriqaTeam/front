// @flow

import { reduce, find, whereEq } from 'ramda';

// const findById = id => obj => find(
//   o(propEq('rowId', id), flip(prop)(obj)),
//   keys(obj),
// );

// const search = (treeArr, rowId, arr = []) => {
//   // const findByRowId = find(whereEq({ rowId }));
//   // const result = findByRowId(tree);

//   // const result = findByMutationId(rowId)(tree);
//   // const testObj = { rowId: 111, test: { rowId: 2222 } };
//   // const isPropEq = propEq('rowId', 111);
//   // const flipResult = flip(prop)(testObj);
//   // const findResult = findById(111)(testObj);

//   // const result = find(n => n === 'rowId', keys(tree));

//   // console.log('^^^^ search util: ', {
//   //   tree,
//   //   result,
//   // });

//   // forEach(key => {
//   //   if (tree[key]) {
//   //     arr.shift()
//   //   }
//   // }, keys(tree));

//   // const result = find(whereEq({ rowId }), treeArr);
//   // if (!result) {
//   //   forEach(obj => {
//   //     search(obj.children, rowId);
//   //   }, treeArr);
//   // }

//   // arr.shift(result);
//   // return arr;
//   // if (result && result.parentId) {
//   //   search(tree, result.parentId, arr);
//   // } else {
//   //   return arr;
//   // }
// };

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

const search = (arr, rawId, stack = []) => {
  const result = find(whereEq({ rawId }))(arr);
  stack.unshift(result);
  if (result.parentId) {
    search(arr, result.parentId, stack);
  }
  return stack;
};

export default search;
