// @flow

import React from 'react';
import { pathOr } from 'ramda';

import { getCookie } from 'utils';

import locale from 'translation/locales';

const supplant = (s: string, d: {}) => {
  let ss = s;
  Object.keys(d).forEach(p => {
    if ({}.hasOwnProperty.call(d, p)) {
      ss = ss.replace(new RegExp(`{${p}}`, 'g'), d[p]);
    }
  });
  return ss;
};

const translateKey = (path: any, obj: any) =>
  path.split('.').reduce((prev, curr) => prev[curr], obj);

const createHTMLMarkup = (html: string) => ({ __html: html });

export const t = (
  key: string,
  placeholders?: { [string]: string },
  isHTML?: boolean,
  options?: { tagName: string },
) => {
  const localeValue = pathOr('en', ['value'], getCookie('locale'));
  const result = translateKey(
    key,
    // $FlowIgnore
    locale[localeValue]['messages'], // eslint-disable-line
  );
  const tagName = options ? options.tagName : 'span';
  if (typeof placeholders === 'undefined') {
    return result;
  }
  const finalResult = supplant(result, placeholders);
  return isHTML
    ? // eslint-disable-next-line
      React.createElement(
        tagName,
        { dangerouslySetInnerHTML: createHTMLMarkup(finalResult) },
        null,
      )
    : finalResult;
};

export const getCurrentLang = () => {
  const cookieLocale = pathOr('en', ['value'], getCookie('locale'));
  return cookieLocale;
};
