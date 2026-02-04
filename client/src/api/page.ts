import request from '@/request';
import type { Article, ArticleList, ArticleData } from '@/../types/api';

export default {
  getPages(page: number, title: string, category: string, tag: string) {
    return request.get<ArticleList, ArticleList>('articles', { params: { type: 'page', page, title, category, tag } });
  },

  getData(id: string) {
    return request.get<ArticleData, ArticleData>(`articles/${id}`, { params: { type: 'page' } });
  },

  create(meta: string, content: string) {
    return request.post<Article, Article>('articles', { meta, content }, { params: { type: 'page' } });
  },

  update(id: string, meta: string, content: string) {
    return request.put<void, void>(`articles/${id}`, { meta, content }, { params: { type: 'page' } });
  },

  remove(id: string) {
    return request.delete<void, void>(`articles/${id}`, { params: { type: 'page' } });
  },
};
