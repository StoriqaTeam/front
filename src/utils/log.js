// @flow

let debug: Function = () => {};
let info: Function = () => {};
let warn: Function = () => {};
let error: Function = () => {};

/* eslint-disable */
if (process.env.NODE_ENV === 'development') {
  debug = console.log;
  info = console.info;
  warn = console.warn;
  error = console.error;
}
/* eslint-enable */

export default {
  debug,
  info,
  warn,
  error,
};
