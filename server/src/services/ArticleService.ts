import type Hexo from 'hexo';
import type Model from 'model';
import type Query from 'query';
import type Document from 'document';
import type { CategorySchema, PageSchema, PostSchema, TagSchema } from 'hexo/dist/types';

import { basename, dirname, join } from 'path';
import { parse, split, stringify } from 'hexo-front-matter';
import { exists, mkdir, rename, rmdir, unlink, writeFile } from 'hexo-fs';

export default class ArticleService {
  constructor(
    private hexo: Hexo,
    private type: string,
    private model: Model<PostSchema | PageSchema>,
  ) {
  }

  getArticles(title?: string | undefined, category?: string | undefined, tag?: string | undefined): Query<PostSchema | PageSchema> {
    return this.model.filter((article: Document<PostSchema | PageSchema>) => {
      if (title && !article.title.toLowerCase().includes(title.toLowerCase())) return false;
      if (category && !(article.categories as Query<CategorySchema>).some(c => c.name === category)) return false;
      if (tag && !(article.tags as Query<TagSchema>).some(t => t.name === tag)) return false;
      return true;
    }).sort('date', -1);
  }

  getData(query: string | object): {
      data: string;
      content: string;
      separator: string;
      prefixSeparator: boolean;
    } | {
      content: string;
      data?: undefined;
      separator?: undefined;
      prefixSeparator?: undefined;
    } | null {
    const document = this.findDocument(query);
    if (!document) return null;
    return split(document.raw);
  }

  async create(meta: string, content: string): Promise<Document<PostSchema | PageSchema> | undefined> {
    const compiled = parse(['---', meta, '---', content].join('\n'));
    if (!compiled.title) throw new Error('Title cannot be empty!');

    compiled.date = compiled.updated = new Date();
    compiled.layout = this.type;

    const file = await this.hexo.post.create(compiled);
    await this.hexo.source.process();
    return this.findDocument({ 'source': this.toRelativePath(file.path) });
  }

  async update(id: string, meta: string, content: string): Promise<Document<PostSchema | PageSchema> | undefined> {
    const document = this.findDocument(id);
    if (!document) throw new Error('The article with ID ' + id + ' could not be found!');

    const compiled = parse(['---', meta, '---', content].join('\n'));
    compiled.updated = new Date();
    compiled.layout = this.type;

    await writeFile(document.full_source, stringify(compiled));
    await this.hexo.source.process();
    return this.findDocument({ 'source': this.toRelativePath(document.full_source) });
  }

  async remove(id: string) {
    const document = this.findDocument(id);
    if (!document) throw new Error('The article with ID ' + id + ' could not be found!');

    if (this.type === 'page') {
      await rmdir(dirname(document.full_source));
    } else if (this.type === 'post') {
      await unlink(document.full_source);
    }

    await this.hexo.source.process();
  }

  async publish(id: string): Promise<Document<PostSchema | PageSchema> | undefined> {
    if (this.type !== 'post') return;

    const document = this.findDocument(id);
    if (!document) throw new Error('The article with ID ' + id + ' could not be found!');

    const postDir = join(this.hexo.source_dir, '_posts');
    const fullSource = join(postDir, basename(document.full_source));
    if (!await exists(postDir)) await mkdir(postDir);

    await rename(document.full_source, fullSource);
    await this.hexo.source.process();
    return this.findDocument({ 'source': this.toRelativePath(fullSource) });
  }

  async unpublish(id: string): Promise<Document<PostSchema | PageSchema> | undefined> {
    if (this.type !== 'post') return;

    const document = this.findDocument(id);
    if (!document) throw new Error('The article with ID ' + id + ' could not be found!');

    const draftDir = join(this.hexo.source_dir, '_drafts');
    const fullSource = join(draftDir, basename(document.full_source));
    if (!await exists(draftDir)) await mkdir(draftDir);

    await rename(document.full_source, fullSource);
    await this.hexo.source.process();
    return this.findDocument({ 'source': this.toRelativePath(fullSource) });
  }

  findDocument(query: string | object): Document<PostSchema | PageSchema> | undefined {
    if (typeof (query) === 'string') {
      return this.model.findById(query);
    } else {
      return this.model.findOne(query);
    }
  }

  toRelativePath(path: string): string {
    return path.slice(this.hexo.source_dir.length).replace(/\\/g, '/');
  }
};
