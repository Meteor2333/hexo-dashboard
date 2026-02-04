export interface Article {
  id: string;
  title: string;
  categories: string[];
  tags: string[];
  date: string;
  updated: string;
  isDraft: boolean;
}

export interface ArticleList {
  total: number;
  list: Article[];
}

export interface ArticleData {
  meta: string;
  content: string;
}

export interface Config {
  config: string;
}

export interface TaxonomyList {
  taxonomies: string[];
}
