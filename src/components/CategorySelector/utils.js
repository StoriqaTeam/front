// @flow

import * as R from 'ramda';

export const byLang = (lang: string) => R.find(R.whereEq({ lang }));

type NameType = {
  lang: string,
  text: string,
}

export const getNameText = (arr: Array<NameType>, lang: string) => {
  let name = byLang(lang)(arr);
  if (!name || !name.text) name = byLang('EN')(arr);
  return name ? name.text : null;
};

export const flattenFunc = R.reduce((acc, nextItem) => {
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
