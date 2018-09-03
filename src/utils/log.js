// @flow

const log = require('node-pretty-log');

const debug = (val: any, args: any) => log('info', val, args);
const info = (val: any, args: any) => log('info', val, args);
const warn = (val: any, rest: any) => log('warn', val, rest);
const error = (val: any, rest: any) => log('error', val, rest);

export default {
  debug,
  info,
  warn,
  error,
};
