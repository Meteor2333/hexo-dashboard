import type { NextHandleFunction } from 'connect';

// import UnauthorizedError from '../errors/UnauthorizedError';

const auth: NextHandleFunction = (req, _res, next) => {
  void req;
  //todo
  // if (req.url?.includes('/auth')) return next();
  // if (req.session && req.session.loggedin) return next();
  // throw new UnauthorizedError('Please login first!');
  return next();
};

export default auth;
