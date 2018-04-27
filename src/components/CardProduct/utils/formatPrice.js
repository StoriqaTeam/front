const price = number =>
  number
    .toFixed(8)
    .replace(/(\d)(?=(\d{3})+\.)/g, '$1,')
    .replace(/\.?0+$/, '');

export default price;
