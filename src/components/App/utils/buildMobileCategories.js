import { map } from 'ramda';

import { extractText } from 'utils';

const build = ({ name, rawId }) => ({
  name: extractText(name),
  rawId,
});

export default function buildMobileCategories(categories) {
  return map(build, categories.children);
}
