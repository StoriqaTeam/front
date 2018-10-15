// @flow strict
// @flow-runtime

import path from 'path';
import { map } from 'ramda';
import { log } from 'utils';

// $FlowIgnore
import translationsJSON from './translations.json';

const validateTranslation = (componentPath: string) => {
  const fullPath = `${path.join(__dirname, `../../src/${componentPath}`)}/i18n`;
  // $FlowIgnore
  const translation = require(fullPath); // eslint-disable-line
  const isValid = translation.validate(translationsJSON[componentPath]);
  if (isValid) {
    log.debug(`OK ${componentPath}`);
  } else {
    log.error(`ERR ${componentPath}`);
  }
};

map(validateTranslation, Object.keys(translationsJSON));
