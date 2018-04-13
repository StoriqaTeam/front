// @flow

import { curry, reduce, assoc, keys } from 'ramda';

/**
 * Creates a new object with the own properties of the provided object, but the
 * keys renamed according to the keysMap object as `{oldKey: newKey}`.
 * When some key is not found in the keysMap, then it's passed as-is.
 *
 * Keep in mind that in the case of keys conflict is behaviour undefined and
 * the result may vary between various JS engines!
 *
 * @sig {a: b} -> {a: *} -> {b: *}
 */

/* const input = { firstName: 'Elisia', age: 22, type: 'human' }
renameKeys({ firstName: 'name', type: 'kind', foo: 'bar' })(input)
//=> { name: 'Elisia', age: 22, kind: 'human' } */

const renameKeys = curry((keysMap, obj) =>
  reduce((acc, key) => assoc(keysMap[key] || key, obj[key], acc), {}, keys(obj)));

export default renameKeys;
