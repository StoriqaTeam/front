import { flatten } from 'ramda';

import { extractText } from './index';

/**
 * @desc Extracts de desired attribute from the variants array
 * @param {[]} array
 * @param {string} attrName
 * @param {string} [lang] = 'EN'
 * @return {[]}
 */
export default function extractAttributes(array: [], attrName: string, lang: string = 'EN'): [] {
  /* eslint-disable arrow-body-style */
  const filteredAttributes = array.map(({ attributes }) => {
    return attributes.map(({ attribute }) => {
      const name = extractText(attribute.name, lang);
      return {
        name,
        values: attribute.metaField.values,
      };
    });
  });
  return flatten(filteredAttributes).filter(({ name }) => name === attrName);
}
