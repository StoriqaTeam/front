// @flow

let debug: Function = () => {};
let info: Function = () => {};
let warn: Function = () => {};
let error: Function = () => {};

/* eslint-disable */
if (process.env.NODE_ENV === 'development') {
  debug = (...args) => {
    console.log(Date.now(), ...args);
  };
  info = (...args) => {
    console.info(Date.now(), ...args);
  };
  warn = (...args) => {
    console.warn(Date.now(), ...args);
  };
  error = (...args) => {
    console.error(Date.now(), ...args);
  };
}
/* eslint-enable */

export default {
  debug,
  info,
  warn,
  error,
};
