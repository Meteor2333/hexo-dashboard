<template>
  <div
    class="article-list"
    tabindex="0"
  >
    <div class="page-header">
      <h2 class="page-title">{{ title }}</h2>
      <el-button type="primary" :icon="Plus" @click="handleCreate">
        {{ createText }}
      </el-button>
    </div>

    <!-- Filters -->
    <div class="filters-bar">
      <el-input
        v-model="filters.title"
        :placeholder="t('common.search')"
        :prefix-icon="Search"
        clearable
        class="filter-input"
        @keyup.enter="loadArticles"
        @clear="loadArticles"
      />

      <template v-if="showTaxonomyFilters">
        <el-select
          v-model="filters.category"
          :placeholder="t('common.category')"
          clearable
          filterable
          class="filter-select"
          @change="loadArticles"
        >
          <el-option :label="t('common.all')" value="" />
          <el-option
            v-for="category in categories"
            :key="category"
            :label="category"
            :value="category"
          />
        </el-select>

        <el-select
          v-model="filters.tag"
          :placeholder="t('common.tag')"
          clearable
          filterable
          class="filter-select"
          @change="loadArticles"
        >
          <el-option :label="t('common.all')" value="" />
          <el-option
            v-for="tag in tags"
            :key="tag"
            :label="tag"
            :value="tag"
          />
        </el-select>
      </template>

      <el-button @click="resetFilters">{{ t('common.reset') }}</el-button>
    </div>

    <!-- Table -->
    <div class="table-container">
      <el-table :data="articles" v-loading="loading" stripe>
        <el-table-column :label="t('common.title')" min-width="300">
          <template #default="{ row }">
            <span class="row-title" @click="$emit('edit', row.id)">{{ row.title }}</span>
          </template>
        </el-table-column>

        <el-table-column v-if="showStatusColumn" :label="t('common.status')" min-width="100">
          <template #default="{ row }">
            <el-tag :type="row.isDraft ? 'info' : 'success'">
              {{ row.isDraft ? t('common.draft') : t('common.published') }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column v-if="showCategoryColumn" :label="t('common.category')" min-width="150" class-name="hide-on-mobile">
          <template #default="{ row }">
            <span class="text-muted">{{ row.categories?.join(', ') || '-' }}</span>
          </template>
        </el-table-column>

        <el-table-column v-if="showTagColumn" :label="t('common.tag')" min-width="150" class-name="hide-on-mobile">
          <template #default="{ row }">
            <span class="text-muted">{{ row.tags?.join(', ') || '-' }}</span>
          </template>
        </el-table-column>

        <el-table-column v-if="showUpdatedColumn" :label="t('common.updated')" min-width="150" class-name="hide-on-mobile">
          <template #default="{ row }">
            <span class="text-muted">{{ formatDate(row.updated) }}</span>
          </template>
        </el-table-column>

        <el-table-column :label="t('common.actions')" min-width="200">
          <template #default="{ row }">
            <div class="action-buttons">
              <el-button-group>
                <el-button plain @click="$emit('edit', row.id)">
                  {{ t('common.edit') }}
                </el-button>
                <template v-if="showPublishActions">
                  <el-button
                    v-if="row.isDraft"
                    type="success"
                    plain
                    @click="handlePublish(row)"
                  >
                    {{ t('common.publish') }}
                  </el-button>
                  <el-button
                    v-else
                    type="warning"
                    plain
                    @click="handleUnpublish(row)"
                  >
                    {{ t('common.unpublish') }}
                  </el-button>
                </template>
                <el-button type="danger" plain @click="handleDelete(row)">
                  {{ t('common.delete') }}
                </el-button>
              </el-button-group>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- Pagination -->
    <div class="pagination-container">
      <el-pagination
        v-model:current-page="currentPage"
        :page-size="10"
        :total="total"
        hide-on-single-page
        layout="prev, pager, next"
        @current-change="loadArticles"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Plus, Search } from '@element-plus/icons-vue';
import { useI18n } from '@/i18n';
import type { Article, ArticleList, TaxonomyList } from '@/../types/api';

interface ArticleApi {
  getList: (page: number, title: string, category: string, tag: string) => Promise<ArticleList>;
  remove: (id: string) => Promise<void>;
  publish?: (id: string) => Promise<Article>;
  unpublish?: (id: string) => Promise<Article>;
}

interface TaxonomyApi {
  getCategories: () => Promise<TaxonomyList>;
  getTags: () => Promise<TaxonomyList>;
}

const props = defineProps<{
  title: string;
  createText: string;
  deleteConfirmText: string;
  api: ArticleApi;
  taxonomyApi?: TaxonomyApi;
  showStatusColumn?: boolean;
  showCategoryColumn?: boolean;
  showTagColumn?: boolean;
  showUpdatedColumn?: boolean;
  showPublishActions?: boolean;
  showTaxonomyFilters?: boolean;
}>();

const emit = defineEmits<{
  create: [];
  edit: [id: string];
}>();

const { t } = useI18n();

const loading = ref(false);
const articles = ref<Article[]>([]);
const total = ref(0);
const currentPage = ref(1);
const categories = ref<string[]>([]);
const tags = ref<string[]>([]);

const filters = reactive({
  title: '',
  category: '',
  tag: '',
});

const formatDate = (dateStr: string) => {
  if (!dateStr) return '-';
  const date = new Date(dateStr);
  return date.toLocaleString(undefined, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const loadArticles = async () => {
  loading.value = true;
  try {
    const res = await props.api.getList(currentPage.value, filters.title, filters.category, filters.tag);
    articles.value = res.list;
    total.value = res.total;
  } finally {
    loading.value = false;
  }
};

const loadTaxonomies = async () => {
  if (!props.taxonomyApi) return;
  const [categoryRes, tagRes] = await Promise.all([
    props.taxonomyApi.getCategories(),
    props.taxonomyApi.getTags(),
  ]);
  categories.value = categoryRes.taxonomies;
  tags.value = tagRes.taxonomies;
};

const resetFilters = () => {
  filters.title = '';
  filters.category = '';
  filters.tag = '';
  currentPage.value = 1;
  loadArticles();
};

const handleCreate = () => {
  emit('create');
};

const handlePublish = async (article: Article) => {
  if (!props.api.publish) return;
  await ElMessageBox.confirm(t('posts.publishConfirm'), t('common.confirm'), {
    confirmButtonText: t('common.confirm'),
    cancelButtonText: t('common.cancel'),
  });
  await props.api.publish(article.id);
  ElMessage.success(t('common.success'));
  loadArticles();
};

const handleUnpublish = async (article: Article) => {
  if (!props.api.unpublish) return;
  await ElMessageBox.confirm(t('posts.unpublishConfirm'), t('common.confirm'), {
    confirmButtonText: t('common.confirm'),
    cancelButtonText: t('common.cancel'),
    type: 'warning',
  });
  await props.api.unpublish(article.id);
  ElMessage.success(t('common.success'));
  loadArticles();
};

const handleDelete = async (article: Article) => {
  await ElMessageBox.confirm(props.deleteConfirmText, t('common.confirm'), {
    confirmButtonText: t('common.confirm'),
    cancelButtonText: t('common.cancel'),
    type: 'warning',
  });
  await props.api.remove(article.id);
  ElMessage.success(t('common.success'));
  loadArticles();
};

onMounted(() => {
  loadArticles();
  loadTaxonomies();
});
</script>

<style scoped>
.article-list {
  padding: 24px;
  max-width: 1400px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.page-title {
  font-size: 24px;
  font-weight: 600;
  color: var(--hd-text);
  margin: 0;
}

.filters-bar {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.filter-input {
  width: 240px;
}

.filter-select {
  width: 180px;
}

.table-container {
  background-color: var(--hd-bg);
  border: 1px solid var(--hd-border);
  border-radius: 8px;
  overflow: hidden;
}

.row-title {
  color: var(--hd-text);
  font-size: 15px;
  cursor: pointer;
  transition: color 0.2s;
}

.row-title:hover {
  color: var(--hd-accent);
  text-decoration: underline;
}

.text-muted {
  color: var(--hd-text-tertiary);
  font-size: 15px;
}

.action-buttons {
  display: flex;
  padding-right: 12px;
}

.action-buttons :deep(.el-button-group) {
  display: flex;
}

.action-buttons :deep(.el-button-group .el-button.el-button) {
  padding: 5px 10px;
  border-color: var(--hd-border);
}

.pagination-container {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

@media (max-width: 768px) {
  .article-list {
    padding: 16px;
  }

  .page-header {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }

  .filters-bar {
    flex-direction: column;
  }

  .filter-input,
  .filter-select {
    width: 100%;
  }

  :deep(.hide-on-mobile) {
    display: none !important;
  }

  .action-buttons {
    flex-direction: column;
    gap: 0;
  }
}
</style>
