// @flow

import React from 'react';
import { pathOr } from 'ramda';

import { getCookie } from 'utils';

import locale from 'translation/locales';

import type { LocaleMessagesType } from 'translation/types/LocaleMessagesType';
import type { LanguagesType } from 'translation/types/LanguagesType';

const supplant = (s: string, d: {}) => {
  let ss = s;
  Object.keys(d).forEach(p => {
    if ({}.hasOwnProperty.call(d, p)) {
      ss = ss.replace(new RegExp(`{${p}}`, 'g'), d[p]);
    }
  });
  return ss;
};

const translateKey = (path: string, value: string, obj: LocaleMessagesType) =>
  obj[path][value];

const createHTMLMarkup = (html: string) => ({ __html: html });

export const t = (props: {
  path: string,
  value: string,
  placeholders?: {
    [string]: string,
  },
  isHTML?: boolean,
  tagName?: string,
}) => {
  const { path, value, placeholders, isHTML, tagName } = props;
  // $FlowIgnore
  const localeValue: LanguagesType = pathOr(
    'en',
    ['value'],
    getCookie('locale'),
  );
  const result = translateKey(
    path,
    value,
    locale[localeValue]['messages'], // eslint-disable-line
  );
  if (typeof placeholders === 'undefined') {
    return result;
  }
  const finalResult = supplant(result, placeholders);
  return isHTML
    ? // eslint-disable-next-line
      React.createElement(
        tagName || 'span',
        { dangerouslySetInnerHTML: createHTMLMarkup(finalResult) },
        null,
      )
    : finalResult;
};

export const getCurrentLang = () => {
  const cookieLocale = pathOr('en', ['value'], getCookie('locale'));
  return cookieLocale;
};
