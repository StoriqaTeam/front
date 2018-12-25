// @flow strict
export type CollapseItemType = {
  id: string,
  title: string,
  link?: string,
  links?: Array<{
    id: string,
    name: string,
    link?: string,
    pdfLink?: string,
    appLink?: string,
  }>,
  isNew?: boolean,
};
