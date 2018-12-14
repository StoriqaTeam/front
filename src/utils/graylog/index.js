// @flow

// eslint-disable-next-line
let logger = {
  info: (title: string, meta?: { [string]: any }) => {}, // eslint-disable-line
  error: (title: string, meta?: { [string]: any }) => {}, // eslint-disable-line
};

if (!process.env.BROWSER && process.env.NODE_ENV === 'production') {
  // eslint-disable-next-line
  logger = require('gelf-pro').setConfig({
    host: 'graylog-tcp.internal.stq.cloud',
    fields: {
      cluster: `${process.env.GRAYLOG_CLUSTER || 'localhost'}`,
      type: 'ssr',
      source_type: 'frontend',
    },
    adapterName: 'tcp',
    adapterOptions: {
      host: 'graylog-tcp.internal.stq.cloud',
      port: 12201,
      family: 4,
      timeout: 1000,
    },
  });
}

export default logger;
