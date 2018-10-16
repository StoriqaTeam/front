// @flow

import path from 'path';
import glob from 'glob'; // eslint-disable-line
import fs from 'fs';
import { join, split, tail, init, head, assoc, forEach } from 'ramda';
import { log } from 'utils';

const fileMask = '**/i18n.js';
const stopWord = 'src';
const directoriesForSearch = [
  path.join(__dirname, '../../src/components'),
  path.join(__dirname, '../../src/pages'),
];

// TODO: handle case when `stopWord` not exists in `dirs`
const trimDirs = (dirs: string[]): string[] => {
  if (head(dirs) !== stopWord) {
    return trimDirs(tail(dirs));
  }

  return init(tail(dirs));
};

const cropFilename = (filename: string): string => {
  const pathChunks = split('/', filename);
  return join('/', trimDirs(pathChunks));
};

let translations: { [string]: {} } = {};
const matchedFiles: Array<string> = [];

forEach((dir: string) => {
  const files = glob.sync(`${dir}/${fileMask}`);
  matchedFiles.push(...files);
}, directoriesForSearch);

forEach(item => {
  const key = cropFilename(item);
  // $FlowIgnore
  const val = require(item).translations; // eslint-disable-line
  translations = assoc(key, val, translations);
}, matchedFiles);

const resultFile = path.join(__dirname, 'translations.json');
fs.writeFile(resultFile, JSON.stringify(translations, null, 2), err => {
  if (!err) {
    log.debug(`Check file ${resultFile}`);
  } else {
    log.error(err);
  }
});
