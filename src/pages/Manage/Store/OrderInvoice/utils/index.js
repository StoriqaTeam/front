// @flow strict

export const formatStatus = (str: string): string =>
  str.replace(/[\W_]+/g, ' ').toLowerCase();
