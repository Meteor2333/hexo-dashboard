<template>
  <ArticleListComponent
    :title="t('pages.title')"
    :create-text="t('pages.newPage')"
    :delete-confirm-text="t('pages.deleteConfirm')"
    :api="api"
    :show-updated-column="true"
    @create="router.push('/pages/new')"
    @edit="(id) => router.push(`/pages/${id}`)"
  />
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import ArticleListComponent from '@/components/ArticleListComponent.vue';
import { useI18n } from '@/i18n';
import pageApi from '@/api/page';

const router = useRouter();
const { t } = useI18n();

const api = {
  getList: pageApi.getPages,
  remove: pageApi.remove,
};
</script>
