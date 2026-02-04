import request from '@/request';
import type { TaxonomyList } from '@/../types/api';

export default {
  getTags() {
    return request.get<TaxonomyList, TaxonomyList>('taxonomies', { params: { type: 'tag' } });
  },
};
