// @flow

import path from 'path';
import glob from 'glob';
import fs from 'fs';
import { map, join, split, tail, init, head, assoc } from 'ramda';

const fileMask = '**/i18n.js';
const stopWord = 'src';
const paths = [
  path.join(__dirname, '../src/components/**/i18n.js'),
  // path.join(__dirname, '../src/pages'),
];

const trimDirs = (paths: string[]): string[] => {
  if (head(paths) !== stopWord) {
    return trimDirs(tail(paths));
  } else {
    return init(tail(paths));
  }
};

const cropFilename = (filename: string): string => {
  const pathChunks = split('/', filename);

  return join('/', trimDirs(pathChunks));
};

let translations: { [string]: {} } = {};
const matchedFiles = glob.sync(
  path.join(__dirname, '../src/components/**/i18n.js'),
);
map(item => {
  const key = cropFilename(item);
  // $FlowIgnore
  const val = require(item).translations;
  translations = assoc(key, val, translations);
}, matchedFiles);

fs.writeFile(
  path.join(__dirname, 'translations.json'),
  JSON.stringify(translations, null, 2),
  err => {
    if (!err) {
      console.log(`Check file ${path.join(__dirname, 'translations.json')}`);
    } else {
      console.error(err);
    }
  },
);
