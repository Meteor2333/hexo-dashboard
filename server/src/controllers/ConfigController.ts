import type Hexo from 'hexo';
import type { RequestHandler } from 'express';

import ConfigService from '../services/ConfigService';
import NotFoundError from '../errors/NotFoundError';
import BadRequestError from '../errors/BadRequestError';

export default class ConfigController {
  private readonly services: Record<string, ConfigService>;

  constructor(hexo: Hexo) {
    this.services = {
      mainconfig: new ConfigService(hexo, 'mainconfig'),
      themeconfig: new ConfigService(hexo, 'themeconfig'),
    };
  }

  getConfig: RequestHandler = async (req, res) => {
    const type = req.query.type;
    if (!type || typeof type !== 'string' || !this.services[type]) {
      throw new BadRequestError("Invalid 'type' query parameter!");
    }

    const config = await this.services[type].getConfig();
    if (!config) {
      throw new NotFoundError('Config not found!');
    }

    res.json({ config });
  };

  updateConfig: RequestHandler = async (req, res) => {
    const type = req.query.type;
    if (!type || typeof type !== 'string' || !this.services[type]) {
      throw new BadRequestError("Invalid 'type' query parameter!");
    }

    const body = req.body;
    if (!body || typeof body !== 'object') {
      throw new BadRequestError('Request body must be a JSON object!');
    }

    const config = body.config;
    if (typeof config !== 'string') {
      throw new BadRequestError("Missing 'config' in request body!");
    }

    await this.services[type].updateConfig(config);
    res.end();
  };
}

