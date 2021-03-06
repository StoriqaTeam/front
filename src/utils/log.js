// @flow

import moment from 'moment';

let debug: Function = () => {};
let info: Function = () => {};
let warn: Function = () => {};
let error: Function = () => {};

const timestamp = (): string =>
  `[${moment().format('HH:mm:ss:SSS YYYY-MM-DD')}]`;

/* eslint-disable */
if (process.env.NODE_ENV === 'development') {
  debug = (...args) => {
    console.log('\n', timestamp(), ...args, '\n');
  };
  info = (...args) => {
    console.info(timestamp(), ...args);
  };
  warn = (...args) => {
    console.warn(timestamp(), ...args);
  };
  error = (...args) => {
    console.error('\n', timestamp(), ...args, '\n');
  };
}
/* eslint-enable */

export default {
  debug,
  info,
  warn,
  error,
};
