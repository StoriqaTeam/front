// @flow strict
import { isNil, assocPath } from 'ramda';

const setZindex = (element: ?HTMLInputElement) => (value: string) =>
  !isNil(element) ? assocPath(['style', 'zIndex'], value, element) : null;

export default setZindex;
