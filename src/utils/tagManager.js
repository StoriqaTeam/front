// @flow

import { pathOr } from 'ramda';

const setWindowTag = (fieldName: string, value: any) => {
  if (process.env.BROWSER) {
    const tagManager = pathOr({}, ['tagManager'], window);
    tagManager[fieldName] = value;
    window.tagManager = tagManager;
  }
};

export default setWindowTag;
