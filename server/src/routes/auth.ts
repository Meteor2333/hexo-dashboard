import type Hexo from 'hexo';

import { Router } from 'express';
import AuthController from '../controllers/AuthController';

export default function (hexo: Hexo): Router {
  const router: Router = Router();
  const controller = new AuthController(hexo);

  router.post('/', controller.authenticate);
  return router;
}
