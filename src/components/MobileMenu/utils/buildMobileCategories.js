import { map, isEmpty, isNil } from 'ramda';

import { extractText } from 'utils';

function build({ name, rawId, children }) {
  return {
    name: extractText(name),
    rawId,
    children:
      !isEmpty(children) && !isNil(children) ? map(build, children) : [],
  };
}

const buildMobileCategories = categories => map(build, categories.children);

export default buildMobileCategories;
