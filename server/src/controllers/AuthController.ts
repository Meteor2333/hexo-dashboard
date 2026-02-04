import type Hexo from 'hexo';
import type { RequestHandler } from 'express';

import AuthService from '../services/AuthService';
import BadRequestError from '../errors/BadRequestError';
import UnauthorizedError from '../errors/UnauthorizedError';

export default class AuthController {
  private readonly service: AuthService;

  constructor(hexo: Hexo) {
    this.service = new AuthService(hexo);
  }

  authenticate: RequestHandler = (req, res) => {
    const body = req.body;
    if (!body || typeof body !== 'object') {
      throw new BadRequestError('Request body must be a JSON object!');
    }

    const username = body.username;
    const password = body.password;
    if (!username || typeof username !== 'string' || !password || typeof password !== 'string') {
      throw new BadRequestError("Missing 'username' or 'password' field in request body!");
    }

    const verified = this.service.authenticate(username.trim(), password.trim());
    if (!verified) {
      throw new UnauthorizedError('Invalid username or password!');
    }

    //todo
    // req.session.loggedin = true;
    res.end();
  };
}
