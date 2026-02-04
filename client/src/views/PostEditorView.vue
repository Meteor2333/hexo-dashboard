<template>
  <ArticleEditorComponent
    :article-id="articleId"
    :title="isNew ? t('posts.newPost') : t('posts.editPost')"
    :default-meta="defaultMeta"
    :api="api"
    @back="router.push('/posts')"
    @saved="(id) => router.replace(`/posts/${id}`)"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import ArticleEditorComponent from '@/components/ArticleEditorComponent.vue';
import { useI18n } from '@/i18n';
import postApi from '@/api/post';

const route = useRoute();
const router = useRouter();
const { t } = useI18n();

const articleId = computed(() => route.params.id as string);
const isNew = computed(() => articleId.value === 'new');

const defaultMeta = `title: New Post\ncategories: \ntags: \ndate: ${new Date().toLocaleString()}`;

const api = {
  getData: postApi.getData,
  create: postApi.create,
  update: postApi.update,
};
</script>
