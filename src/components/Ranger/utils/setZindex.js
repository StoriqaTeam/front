// @flow strict
import { setElementValue } from './index';

const setZindex = (element: ?HTMLInputElement) => (value: string) =>
  setElementValue(element)(['style', 'zIndex'], value);

export default setZindex;
