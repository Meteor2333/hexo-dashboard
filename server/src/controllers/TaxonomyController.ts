import type Hexo from 'hexo';
import type { RequestHandler } from 'express';

import TaxonomyService from '../services/TaxonomyService';
import BadRequestError from '../errors/BadRequestError';

export default class TaxonomyController {
  private readonly services: Record<string, TaxonomyService>;

  constructor(hexo: Hexo) {
    this.services = {
      category: new TaxonomyService(hexo.model('Category')),
      tag: new TaxonomyService(hexo.model('Tag')),
    };
  }

  getTaxonomies: RequestHandler = (req, res) => {
    const query = req.query;
    const type = query.type;
    if (!type || typeof type !== 'string' || !this.services[type]) {
      throw new BadRequestError("Invalid 'type' query parameter!");
    };

    const taxonomies = this.services[type].getTaxonomies();
    res.json({ taxonomies });
  };
}
