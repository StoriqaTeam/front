// @flow strict
import { isNil, assocPath } from 'ramda';

const setElementValue = (element: ?HTMLInputElement) => (
  props: Array<string>,
  value: string,
) => (!isNil(element) ? assocPath(props, value, element) : null);

export default setElementValue;
