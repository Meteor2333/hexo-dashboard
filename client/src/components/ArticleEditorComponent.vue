<template>
  <div
    class="article-editor"
    tabindex="0"
    @keydown.ctrl.s.prevent.stop="handleSave"
    @keydown.meta.s.prevent.stop="handleSave"
  >
    <div class="editor-header">
      <el-button text :icon="ArrowLeft" @click="$emit('back')">
        {{ t('common.back') }}
      </el-button>
      <h2 class="editor-title">{{ title }}</h2>
      <el-button type="primary" :icon="Check" @click="handleSave" :loading="saving">
        {{ t('common.save') }}
      </el-button>
    </div>

    <div v-loading="loading" class="editor-content">
      <!-- Meta Section -->
      <div class="editor-section">
        <div class="section-header">
          <el-icon><Document /></el-icon>
          <span>{{ t('editor.meta') }}</span>
        </div>
        <div class="meta-editor">
          <Codemirror
            v-model:value="meta"
            :options="yamlOptions"
            class="code-editor"
          />
        </div>
      </div>

      <!-- Content Section -->
      <div class="editor-section content-section">
        <div class="section-header">
          <el-icon><EditPen /></el-icon>
          <span>{{ t('editor.content') }}</span>
        </div>
        <div class="content-editor">
          <Codemirror
            v-model:value="content"
            :options="markdownOptions"
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
import { ArrowLeft, Check, Document, EditPen } from '@element-plus/icons-vue';
import Codemirror from 'codemirror-editor-vue3';
import 'codemirror/mode/yaml/yaml.js';
import 'codemirror/mode/markdown/markdown.js';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/base16-dark.css';
import { useI18n } from '@/i18n';
import { useTheme } from '@/composables/useTheme';
import type { Article, ArticleData } from '@/../types/api';

interface ArticleApi {
  getData: (id: string) => Promise<ArticleData>;
  create: (meta: string, content: string) => Promise<Article>;
  update: (id: string, meta: string, content: string) => Promise<void>;
}

const props = defineProps<{
  articleId: string;
  title: string;
  defaultMeta: string;
  api: ArticleApi;
}>();

const emit = defineEmits<{
  back: [];
  saved: [id: string];
}>();

const { t } = useI18n();
const { currentTheme } = useTheme();

const isNew = computed(() => props.articleId === 'new');

const loading = ref(false);
const saving = ref(false);
const meta = ref('');
const content = ref('');

const editorTheme = computed(() => currentTheme.value === 'dark' ? 'base16-dark' : 'default');

const yamlOptions = computed(() => ({
  mode: 'yaml',
  theme: editorTheme.value,
  lineNumbers: true,
  lineWrapping: true,
  tabSize: 2,
}));

const markdownOptions = computed(() => ({
  mode: 'markdown',
  theme: editorTheme.value,
  lineNumbers: true,
  lineWrapping: true,
  tabSize: 2,
}));

const loadArticle = async () => {
  if (isNew.value) {
    meta.value = props.defaultMeta;
    content.value = '';
    return;
  }

  loading.value = true;
  try {
    const res = await props.api.getData(props.articleId);
    meta.value = res.meta;
    content.value = res.content;
  } catch {
    ElMessage.error(t('common.error'));
  } finally {
    loading.value = false;
  }
};

const handleSave = async () => {
  saving.value = true;
  try {
    if (isNew.value) {
      const res = await props.api.create(meta.value, content.value);
      ElMessage.success(t('common.success'));
      emit('saved', res.id);
    } else {
      await props.api.update(props.articleId, meta.value, content.value);
      ElMessage.success(t('common.success'));
    }
  } catch {
    ElMessage.error(t('common.error'));
  } finally {
    saving.value = false;
  }
};

onMounted(() => {
  loadArticle();
});
</script>

<style scoped>
.article-editor {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.editor-header {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 24px;
  border-bottom: 1px solid var(--hd-border);
  background-color: var(--hd-bg-secondary);
}

.editor-title {
  flex: 1;
  font-size: 18px;
  font-weight: 600;
  color: var(--hd-text);
  margin: 0;
}

.editor-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding: 16px;
  gap: 16px;
}

.editor-section {
  display: flex;
  flex-direction: column;
  border: 1px solid var(--hd-border);
  border-radius: 8px;
  overflow: hidden;
}

.content-section {
  flex: 1;
  min-height: 0;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background-color: var(--hd-bg-secondary);
  border-bottom: 1px solid var(--hd-border);
  font-weight: 500;
  color: var(--hd-text-secondary);
}

.meta-editor {
  height: 150px;
}

.content-editor {
  flex: 1;
  min-height: 300px;
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
  .editor-header {
    padding: 12px 16px;
  }

  .editor-title {
    font-size: 16px;
  }

  .editor-content {
    padding: 12px;
  }

  .meta-editor {
    height: 120px;
  }
}
</style>
