// @flow strict

import { isNil, has, filter } from 'ramda';

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
    const [translation] = filter(
      item => has(lang)(item) && item.lang === lang,
      array,
    );
    return isNil(translation) ? array[0].text : translation.text;
  }
  return message;
}
