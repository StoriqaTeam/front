const { split, reject, startsWith, pipe, join, pathOr } = require('ramda');

// returns `{ message: string, payload: object }`
const requestInfoFormatter = req => ({
  message: `${req.method} ${req.originalUrl}`,
  payload: {
    headers: `${JSON.stringify(
      {
        ...req.headers,
        cookie: pipe(
          pathOr('', ['headers', 'cookie']),
          split('; '),
          reject(startsWith('__jwt')),
          join('; '),
        )(req),
      },
      null,
      2,
    )}`,
    body: `${JSON.stringify(req.body, null, 2)}`,
  },
});

const middleware = (req, res, next) => {
  const reqData = requestInfoFormatter(req);

  // IDK why `require('utils/graylog)` doesn't work
  // eslint-disable-next-line
  require('gelf-pro')
    .setConfig({
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
    })
    .info(reqData.message, reqData.payload);

  next();
};

module.exports = { middleware, requestInfoFormatter };
