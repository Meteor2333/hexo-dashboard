<template>
  <ArticleListComponent
    :title="t('posts.title')"
    :create-text="t('posts.newPost')"
    :delete-confirm-text="t('posts.deleteConfirm')"
    :api="api"
    :taxonomy-api="taxonomyApi"
    :show-status-column="true"
    :show-category-column="true"
    :show-tag-column="true"
    :show-updated-column="true"
    :show-publish-actions="true"
    :show-taxonomy-filters="true"
    @create="router.push('/posts/new')"
    @edit="(id) => router.push(`/posts/${id}`)"
  />
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import ArticleListComponent from '@/components/ArticleListComponent.vue';
import { useI18n } from '@/i18n';
import postApi from '@/api/post';
import categoryApi from '@/api/category';
import tagApi from '@/api/tag';

const router = useRouter();
const { t } = useI18n();

const api = {
  getList: postApi.getPosts,
  remove: postApi.remove,
  publish: postApi.publish,
  unpublish: postApi.unpublish,
};

const taxonomyApi = {
  getCategories: categoryApi.getCategories,
  getTags: tagApi.getTags,
};
</script>
