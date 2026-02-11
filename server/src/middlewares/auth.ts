import type { RequestHandler } from 'express';

import UnauthorizedError from '../errors/UnauthorizedError';

const auth: RequestHandler = (req, _res, next) => {
  if (req.session.loggedin) return next();
  if (req.method === 'POST' && req.path === '/auth') return next();
  throw new UnauthorizedError('Please login first!');
};

export default auth;
