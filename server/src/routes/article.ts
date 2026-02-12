import type Hexo from 'hexo';

import { Router } from 'express';
import ArticleController from '../controllers/ArticleController';

export default function (hexo: Hexo) {
  const router = Router();
  const controller = new ArticleController(hexo);

  router.get('/', controller.getArticles);
  router.get('/:id', controller.getData);
  router.post('/', controller.create);
  router.put('/:id', controller.update);
  router.delete('/:id', controller.remove);
  router.post('/:id/status', controller.changeStatus);
  return router;
}
