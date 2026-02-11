<template>
  <ArticleEditorComponent
    :article-id="articleId"
    :title="isNew ? t('pages.newPage') : t('pages.editPage')"
    :default-meta="defaultMeta"
    :api="api"
    @back="router.push('/pages')"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import ArticleEditorComponent from '@/components/ArticleEditorComponent.vue';
import { useI18n } from '@/i18n';
import pageApi from '@/api/page';

const route = useRoute();
const router = useRouter();
const { t } = useI18n();

const articleId = computed(() => route.params.id as string);
const isNew = computed(() => articleId.value === 'new');

const defaultMeta = 'title: New Page';

const api = {
  getData: pageApi.getData,
  create: pageApi.create,
  update: pageApi.update,
};
</script>
