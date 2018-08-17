// @flow

import type { LanguagesType } from './LanguagesType';
import type { HeaderType } from './HeaderType';
import type { FooterType } from './FooterType';
import type { StartType } from './StartType';

export type LocaleType = {
  [LanguagesType]: {|
    locale: LanguagesType,
    messages: {
      header: HeaderType,
      footer: FooterType,
      start: StartType,
    },
  |},
};
