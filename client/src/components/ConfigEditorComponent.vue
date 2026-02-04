<template>
  <div
    class="config-editor"
    tabindex="0"
    @keydown.ctrl.s.prevent.stop="handleSave"
    @keydown.meta.s.prevent.stop="handleSave"
  >
    <div class="page-header">
      <h2 class="page-title">{{ title }}</h2>
      <el-button type="primary" :icon="Check" @click="handleSave" :loading="saving">
        {{ t('common.save') }}
      </el-button>
    </div>

    <div v-loading="loading" class="config-content">
      <div class="config-card">
        <div class="editor-area">
          <Codemirror
            v-model:value="config"
            :options="yamlOptions"
            class="code-editor"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import { Check } from '@element-plus/icons-vue';
import Codemirror from 'codemirror-editor-vue3';
import 'codemirror/mode/yaml/yaml.js';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/base16-dark.css';
import { useI18n } from '@/i18n';
import { useTheme } from '@/composables/useTheme';
import type { Config } from '@/../types/api';

interface ConfigApi {
  getConfig: () => Promise<Config>;
  updateConfig: (config: string) => Promise<void>;
}

const props = defineProps<{
  title: string;
  api: ConfigApi;
}>();

const { t } = useI18n();
const { currentTheme } = useTheme();

const loading = ref(false);
const saving = ref(false);
const config = ref('');

const editorTheme = computed(() => currentTheme.value === 'dark' ? 'base16-dark' : 'default');

const yamlOptions = computed(() => ({
  mode: 'yaml',
  theme: editorTheme.value,
  lineNumbers: true,
  lineWrapping: true,
  tabSize: 2,
}));

const loadConfig = async () => {
  loading.value = true;
  try {
    const res = await props.api.getConfig();
    config.value = res.config;
  } catch {
    ElMessage.error(t('common.error'));
  } finally {
    loading.value = false;
  }
};

const handleSave = async () => {
  saving.value = true;
  try {
    await props.api.updateConfig(config.value);
    ElMessage.success(t('config.saveSuccess'));
  } catch {
    ElMessage.error(t('config.saveError'));
  } finally {
    saving.value = false;
  }
};

onMounted(() => {
  loadConfig();
});
</script>

<style scoped>
.config-editor {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  border-bottom: 1px solid var(--hd-border);
  background-color: var(--hd-bg-secondary);
}

.page-title {
  font-size: 20px;
  font-weight: 600;
  color: var(--hd-text);
  margin: 0;
}

.config-content {
  flex: 1;
  padding: 20px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.config-card {
  flex: 1;
  display: flex;
  flex-direction: column;
  border: 1px solid var(--hd-border);
  border-radius: 8px;
  overflow: hidden;
}

.editor-area {
  flex: 1;
  min-height: 0;
}

.code-editor {
  height: 100%;
}

.code-editor :deep(.CodeMirror) {
  height: 100%;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 14px;
}

html.dark .code-editor :deep(.CodeMirror) {
  background-color: var(--hd-bg-tertiary);
  color: var(--hd-text);
}

html.dark .code-editor :deep(.CodeMirror-gutters) {
  background-color: var(--hd-bg-secondary);
  border-right: 1px solid var(--hd-border);
}

html.dark .code-editor :deep(.CodeMirror-linenumber) {
  color: var(--hd-text-tertiary);
}

@media (max-width: 768px) {
  .page-header {
    padding: 12px 16px;
  }

  .page-title {
    font-size: 18px;
  }

  .config-content {
    padding: 12px;
  }
}
</style>
