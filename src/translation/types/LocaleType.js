// @flow

import type { LanguagesType } from './LanguagesType';
import type { LocaleMessagesType } from './LocaleMessagesType';

export type LocaleType = {
  [LanguagesType]: {|
    locale: LanguagesType,
    messages: LocaleMessagesType,
  |},
};
