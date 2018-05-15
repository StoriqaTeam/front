const cluster = require('cluster');

if (cluster.isMaster) {
  // eslint-disable-next-line
  require('./master');
} else {
  // eslint-disable-next-line
  require('./worker');
}
