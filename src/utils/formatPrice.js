// @flow strict
const price = (number: number, decimals: number = 8) =>
  number
    .toFixed(decimals)
    .replace(/(\d)(?=(\d{3})+\.)/g, '$1,')
    .replace(/\.?0+$/, '');

export default price;
