/* eslint-disable */
const app = require('./app');
const reload = require('express-reload');

const PORT = process.env.PORT || 3003;

app.use(reload(__dirname + '/../src'));

// Why don't I need http createServer
app.listen(PORT, '0.0.0.0', () => {
  console.log(`App listening on port ${PORT}!`)
});
app.on('error', onError);

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}
/* eslint-enable */
