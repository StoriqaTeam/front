// @flow

import { fromPairs, map } from 'ramda';

import languages from 'translation/languages.json';

import header from 'translation/locales/header';
import footer from 'translation/locales/footer';
import start from 'translation/locales/start';

import type { LocaleType } from '../types/LocaleType';

const arr = map(
  item => [
    item.id,
    {
      locale: item.id,
      messages: {
        header: header[item.id],
        footer: footer[item.id],
        start: start[item.id],
      },
    },
  ],
  languages,
);

// $FlowIgnore
const locale: LocaleType = fromPairs(arr);

export default locale;
