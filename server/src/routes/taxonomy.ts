import type Hexo from 'hexo';

import { Router } from 'express';
import TaxonomyController from '../controllers/TaxonomyController';

export default function (hexo: Hexo): Router {
  const router: Router = Router();
  const controller = new TaxonomyController(hexo);

  router.get('/', controller.getTaxonomies);
  return router;
}
