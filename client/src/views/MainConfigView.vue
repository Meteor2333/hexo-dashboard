<template>
  <ConfigEditorComponent :title="t('config.main')" :api="api" />
</template>

<script setup lang="ts">
import ConfigEditorComponent from '@/components/ConfigEditorComponent.vue';
import { useI18n } from '@/i18n';
import mainConfigApi from '@/api/main_config';

const { t } = useI18n();

const api = {
  getConfig: mainConfigApi.getConfig,
  updateConfig: mainConfigApi.updateConfig,
};
</script>
