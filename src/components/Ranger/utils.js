// @flow

import { reduce } from 'ramda';

import { getNameText } from 'utils';

type NameType = {
  lang: string,
  text: string,
}

type ArrayType = {
  rowId: number,
  name: Array<NameType>,
  children: Array<ArrayType>,
}

const prepareForAccordion = (arr: ArrayType, lang: string) =>
  reduce((acc, next) => [
    ...acc,
    {
      name: getNameText(next.name, lang),
      id: next.rawId,
      children: next.children && next.children.length !== 0
        ? prepareForAccordion(next.children, lang)
        : [],
    },
  ], [], arr);

export default prepareForAccordion;
