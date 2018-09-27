// @flow strict
import { setElementValue } from './index';

const setRefValue = (element: ?HTMLInputElement) => (value: string) =>
  setElementValue(element)(['value'], value);

export default setRefValue;
