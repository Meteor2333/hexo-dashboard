import type Model from 'model';
import type { CategorySchema, TagSchema } from 'hexo/dist/types';

export default class TaxonomyService {
  constructor(
    private model: Model<CategorySchema | TagSchema>,
  ) {
  }

  getTaxonomies(): string[] {
    return this.model.map(taxonomy => taxonomy.name);
  }
};
