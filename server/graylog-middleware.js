const graylogger = require('utils/graylog');
const { split, reject, startsWith, pipe, join, pathOr } = require('ramda');

// returns `{ message: string, payload: object }`
const requestInfoFormatter = req => ({
  message: `${req.method} ${req.originalUrl}`,
  payload: {
    headers: `${JSON.stringify(
      {
        ...req.headers,
        cookie: pipe(
          pathOr([], ['headers', 'cookie']),
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

  graylogger.info(reqData.message, reqData.payload);

  next();
};

module.exports = { middleware, requestInfoFormatter };
