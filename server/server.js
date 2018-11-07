/* eslint-disable */
const app = require('./app');
const fs = require('fs');
const path = require('path');
const https = require('https');

const PORT = process.env.PORT || 3003;
const SSL_PORT = process.env.SSL_PORT || 3443;

if (process.env.NODE_ENV === 'development') {
  const reload = require('express-reload');
  app.use(reload(__dirname + '/../src'));
}

// Why don't I need http createServer
app.listen(PORT, '0.0.0.0', () => {
  console.log(`App listening on port ${PORT}!`);
});
app.on('error', onError);

if (process.env.NODE_ENV === 'development') {
  const certOptions = {
    key: fs.readFileSync(path.resolve(__dirname + '/cert/server.key')),
    cert: fs.readFileSync(path.resolve(__dirname + '/cert/server.crt')),
  };

  https.createServer(certOptions, app).listen(SSL_PORT, '0.0.0.0', () => {
    console.log(`App listening for https on port ${SSL_PORT}!`);
  });
}

function onError(error) {
  require('utils/graylog').error('nodejs', error);

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
