import type Hexo from 'hexo';

import { Router } from 'express';
import ConfigController from '../controllers/ConfigController';

export default function (hexo: Hexo) {
  const router = Router();
  const controller = new ConfigController(hexo);

  router.get('/', controller.getConfig);
  router.post('/', controller.updateConfig);
  return router;
}
