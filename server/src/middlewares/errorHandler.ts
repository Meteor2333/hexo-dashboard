import type { ErrorHandleFunction } from 'connect';

import HttpError from '../errors/HttpError';

const error: ErrorHandleFunction = (err, _req, res, next) => {
  if (res.headersSent) return next(err);

  res.setHeader('Content-Type', 'application/json');
  res.statusCode = err instanceof HttpError ? err.code : 500;
  res.statusMessage = err.message;
  return res.end(JSON.stringify({ code: res.statusCode, msg: res.statusMessage }));
};

export default error;
