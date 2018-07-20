// @flow
// prepareForAccordion getting array of categories with children and
// prepare data for accordion

import { reduce } from 'ramda';

import { getNameText } from 'utils';

type NameType = {
  lang: string,
  text: string,
};

type ChildrenType = {
  rawId: number,
  name: Array<NameType>,
  children: Array<ChildrenType>,
};

const prepareForAccordion = (arr: Array<ChildrenType>, lang: string) =>
  reduce(
    (acc, next) => [
      ...acc,
      {
        name: next.name ? getNameText(next.name, lang) : 'unknown',
        id: next.rawId,
        children:
          next.children && next.children.length !== 0
            ? prepareForAccordion(next.children, lang)
            : [],
      },
    ],
    [],
    arr,
  );

export default prepareForAccordion;
