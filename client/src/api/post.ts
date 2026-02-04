import request from '@/request';
import type { Article, ArticleList, ArticleData } from '@/../types/api';

export default {
  getPosts(page: number, title: string, category: string, tag: string) {
    return request.get<ArticleList, ArticleList>('articles', { params: { type: 'post', page, title, category, tag } });
  },

  getData(id: string) {
    return request.get<ArticleData, ArticleData>(`articles/${id}`, { params: { type: 'post' } });
  },

  update(id: string, meta: string, content: string) {
    return request.put<void, void>(`articles/${id}`, { meta, content }, { params: { type: 'post' } });
  },

  create(meta: string, content: string) {
    return request.post<Article, Article>('articles', { meta, content }, { params: { type: 'post' } });
  },

  remove(id: string) {
    return request.delete<void, void>(`articles/${id}`, { params: { type: 'post' } });
  },

  publish(id: string) {
    return request.post<Article, Article>(`articles/${id}/status`, { status: 'publishing' }, { params: { type: 'post' } });
  },

  unpublish(id: string) {
    return request.post<Article, Article>(`articles/${id}/status`, { status: 'draft' }, { params: { type: 'post' } });
  },
};
