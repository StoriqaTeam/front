const cluster = require('cluster');

if (cluster.isMaster) {
  // eslint-disable-next-line
  require('./master');
} else {
  // eslint-disable-next-line
  process.env.NODE_ENV === 'production'
    ? require('./server') // eslint-disable-line
    : require('./worker'); // eslint-disable-line
}
