const lines = require('fs')
  .readFileSync('flow_check.log', 'utf-8')
  .split('\n')
  .filter(Boolean);
const filenames = lines.map(item => item.split(':')[0]);
const unique = Array.from(new Set(filenames));
unique.map(item => console.log(item));
