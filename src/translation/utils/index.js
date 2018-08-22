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

const createHTMLMarkup = (html: string) => ({ __html: html });

export const t = (
  key: string,
  props?: {
    placeholders?: { [string]: string },
    isHTML?: boolean,
    tagName?: string,
  },
) => {
  if (props) {
    const { placeholders, isHTML, tagName } = props;
    const finalResult = placeholders ? supplant(key, placeholders) : key;
    return isHTML
      ? // eslint-disable-next-line
        React.createElement(
          tagName || 'span',
          { dangerouslySetInnerHTML: createHTMLMarkup(finalResult) },
          null,
        )
      : finalResult;
  }
  return key;
};

export const getLocale = () => {
  const localeValue = pathOr('en', ['value'], getCookie('locale'));
  // $FlowIgnore
  return locale[localeValue].messages;
};

export const getCurrentLang = () =>
  pathOr('en', ['value'], getCookie('locale'));
