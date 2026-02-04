import type Hexo from 'hexo';
import type Query from 'query';
import type Document from 'document';
import type { RequestHandler } from 'express';
import type { CategorySchema, PageSchema, PostSchema, TagSchema } from 'hexo/dist/types';

import ArticleService from '../services/ArticleService';
import BadRequestError from '../errors/BadRequestError';

export default class ArticleController {
  private readonly services: Record<string, ArticleService>;

  constructor(hexo: Hexo) {
    this.services = {
      post: new ArticleService(hexo, 'post', hexo.model('Post')),
      page: new ArticleService(hexo, 'page', hexo.model('Page')),
    };
  }

  getArticles: RequestHandler = (req, res) => {
    const query = req.query;

    const type = query.type;
    if (!type || typeof type !== 'string' || !this.services[type]) {
      throw new BadRequestError("Invalid 'type' query parameter!");
    }

    const page = query.page;
    if (!page || typeof page !== 'string') {
      throw new BadRequestError("Missing 'page' query parameter!");
    }

    const title = query.title;
    const category = query.category;
    const tag = query.tag;
    if ((title && typeof title !== 'string') || (category && typeof category !== 'string') || (tag && typeof tag !== 'string')) {
      throw new BadRequestError("Invalid 'title', 'category', or 'tag' query parameter!");
    }

    const size = 10;
    const articles = this.services[type].getArticles(title, category, tag);
    const total = articles.length;
    const list = articles
      .skip((Math.max(1, parseInt(page) || 1) - 1) * size)
      .limit(size)
      .map(this.serializeArticle);
    res.json({ total, list });
  };

  getData: RequestHandler = (req, res) => {
    const type = req.query.type;
    if (!type || typeof type !== 'string' || !this.services[type]) {
      throw new BadRequestError("Invalid 'type' query parameter!");
    }

    const id = req.params.id;
    if (!id || typeof id !== 'string') {
      throw new BadRequestError("Missing 'id' parameter!");
    }

    const article = this.services[type].getData(id);
    if (!article) {
      throw new BadRequestError('Article not found!');
    }

    res.json({ 'meta': article.data, 'content': article.content });
  };

  create: RequestHandler = async (req, res) => {
    const type = req.query.type;
    if (!type || typeof type !== 'string' || !this.services[type]) {
      throw new BadRequestError("Invalid 'type' query parameter!");
    }

    const body = req.body;
    if (!body || typeof body !== 'object') {
      throw new BadRequestError('Request body must be a JSON object!');
    }

    const meta = body.meta;
    const content = body.content;
    if (typeof meta !== 'string' || typeof content !== 'string') {
      throw new BadRequestError("Missing 'meta', or 'content' field in request body!");
    }

    const article = await this.services[type].create(meta, content);
    res.json(this.serializeArticle(article));
  };

  update: RequestHandler = async (req, res) => {
    const type = req.query.type;
    if (!type || typeof type !== 'string' || !this.services[type]) {
      throw new BadRequestError("Invalid 'type' query parameter!");
    }

    const body = req.body;
    if (!body || typeof body !== 'object') {
      throw new BadRequestError('Request body must be a JSON object!');
    }

    const id = req.params.id;
    if (!id || typeof id !== 'string') {
      throw new BadRequestError("Missing 'id' parameter!");
    }

    const meta = body.meta;
    const content = body.content;
    if (typeof meta !== 'string' || typeof content !== 'string') {
      throw new BadRequestError("Missing 'meta', or 'content' field in request body!");
    }

    const article = await this.services[type].update(id, meta, content);
    res.json(this.serializeArticle(article));
  };

  remove: RequestHandler = async (req, res) => {
    const type = req.query.type;
    if (!type || typeof type !== 'string' || !this.services[type]) {
      throw new BadRequestError("Invalid 'type' query parameter!");
    }

    const id = req.params.id;
    if (!id || typeof id !== 'string') {
      throw new BadRequestError("Missing 'id' parameter!");
    }

    await this.services[type].remove(id);
    res.end();
  };

  changeStatus: RequestHandler = async (req, res) => {
    const type = req.query.type;
    if (!type || typeof type !== 'string' || !this.services[type]) {
      throw new BadRequestError("Invalid 'type' query parameter!");
    }

    const body = req.body;
    if (!body || typeof body !== 'object') {
      throw new BadRequestError('Request body must be a JSON object!');
    }

    const id = req.params.id;
    if (!id || typeof id !== 'string') {
      throw new BadRequestError("Missing 'id' parameter!");
    }

    const status = body.status;
    if (!status || typeof status !== 'string') {
      throw new BadRequestError("Missing 'status' field in request body!");
    }

    let article;
    if (status === 'publishing') {
      article = await this.services[type].publish(id);
    } else if (status === 'draft') {
      article = await this.services[type].unpublish(id);
    } else {
      throw new BadRequestError("Invalid 'status' field in request body!");
    }

    res.json(this.serializeArticle(article));
  };

  private serializeArticle(article: Document<PostSchema | PageSchema> | undefined): object {
    if (!article) throw new Error('Article was not found!');
    if (article instanceof Array) return article.map(a => this.serializeArticle(a));
    const serialized = {
      'id': article._id,
      'title': article.title,
      'date': article.date?.valueOf() ?? 0,
      'updated': article.updated?.valueOf() ?? 0,
      'categories': [] as string[],
      'tags': [] as string[],
      'link': article.permalink ?? '',
      'isDraft': article.source?.includes('_draft') ?? false,
      'content': undefined as string | undefined,
    };

    if (article.content) {
      serialized.content = article.content;
    }

    if (article.layout === 'post') {
      serialized.categories = (article.categories as Query<CategorySchema>).map(category => category.name);
      serialized.tags = (article.tags as Query<TagSchema>).map(tag => tag.name);
    }
    return serialized;
  }
}
