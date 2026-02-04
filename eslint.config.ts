import path from 'path';
import { globalIgnores } from 'eslint/config';
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript';
import pluginVue from 'eslint-plugin-vue';

const rules = {
  'no-var': 'error',
  'prefer-const': 'error',
  'eqeqeq': 'error',
  'curly': ['error', 'multi-line'],
  'quotes': ['error', 'single', { avoidEscape: true }],
  'semi': ['error', 'always'],
  'indent': ['error', 2, { SwitchCase: 1 }],
  'comma-dangle': ['error', 'always-multiline'],
  'object-curly-spacing': ['error', 'always'],
  'array-bracket-spacing': ['error', 'never'],
  'no-trailing-spaces': 'error',
  'space-before-blocks': 'error',
  'keyword-spacing': ['error', { before: true, after: true }],
};

export default [
  {
    rules: rules,
  },

  ...defineConfigWithVueTs(
    {
      files: ['client/**/*.{vue,ts,mts,tsx}'],
      languageOptions: {
        parserOptions: {
          tsconfigRootDir: path.join(__dirname, 'client'),
          projectService: true,
        },
      },
    },

    globalIgnores(['**/dist/**', '**/dist-ssr/**', '**/coverage/**']),

    ...pluginVue.configs['flat/essential'],
    vueTsConfigs.recommended,
  ),

  {
    files: ['server/**/*.{ts,mts,tsx}'],
    languageOptions: {
      parserOptions: {
        tsconfigRootDir: path.join(__dirname, 'server'),
        projectService: true,
      },
    },
  },
];
