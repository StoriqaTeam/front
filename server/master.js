const cluster = require('cluster');

cluster.on('disconnect', worker => {
  // eslint-disable-next-line
  console.log(`Worker ${worker.id} died`);
  cluster.fork();
});

cluster.on('online', worker => {
  // eslint-disable-next-line
  console.log(`Worker ${worker.id} running`);
});

cluster.fork();
