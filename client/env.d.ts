/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  const component: DefineComponent<object, object, unknown>;
  export default component;
}

declare module 'codemirror-editor-vue3' {
  import type { DefineComponent } from 'vue';
  const Codemirror: DefineComponent<{
    modelValue?: string;
    options?: object;
  }>;
  export default Codemirror;
}
