<template>
  <ConfigEditorComponent :title="t('config.theme')" :api="api" />
</template>

<script setup lang="ts">
import ConfigEditorComponent from '@/components/ConfigEditorComponent.vue';
import { useI18n } from '@/i18n';
import themeConfigApi from '@/api/theme_config';

const { t } = useI18n();

const api = {
  getConfig: themeConfigApi.getConfig,
  updateConfig: themeConfigApi.updateConfig,
};
</script>
