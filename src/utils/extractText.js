// @flow strict

import { head, isNil, has, filter, prop } from 'ramda';

import validArray from './validArray';

type TranslationType = {
  lang: string,
  text: string,
};

/**
 * @desc Extracts the text property of a valid TranslationType array based on its language
 * @param {[]} array
 * @param {string} [lang] = 'EN'
 * @param {string} [message] = 'No text'
 * @return {string}
 */
export default function extractText(
  array: Array<TranslationType>,
  lang: string = 'EN',
  message: string = 'No Text',
): string {
  if (validArray(array)) {
    const hasLang = has(lang);
    const [translation] = filter(
      item => hasLang(item) && item.lang === lang,
      array,
    );
    return isNil(translation)
      ? prop('text', head(array) || { text: 'No text' })
      : translation.text;
  }
  return message;
}
