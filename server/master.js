/* eslint-disable */
const cluster = require('cluster');

const NUM_OF_WORKERS = 4;

cluster.on('disconnect', worker => {
  console.log(`Worker ${worker.id} died`);
  cluster.fork();
});

cluster.on('online', worker => {
  console.log(`Worker ${worker.id} running`);
});

for (let i = 0; i < NUM_OF_WORKERS; i++) {
  cluster.fork();
}
/* eslint-enable */
