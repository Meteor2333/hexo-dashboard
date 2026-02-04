import { createRouter, createWebHashHistory } from 'vue-router';

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/posts',
    },
    {
      path: '/posts',
      name: 'posts',
      component: () => import('@/views/PostsView.vue'),
    },
    {
      path: '/posts/:id',
      name: 'post-editor',
      component: () => import('@/views/PostEditorView.vue'),
    },
    {
      path: '/pages',
      name: 'pages',
      component: () => import('@/views/PagesView.vue'),
    },
    {
      path: '/pages/:id',
      name: 'page-editor',
      component: () => import('@/views/PageEditorView.vue'),
    },
    {
      path: '/main-config',
      name: 'main-config',
      component: () => import('@/views/MainConfigView.vue'),
    },
    {
      path: '/theme-config',
      name: 'theme-config',
      component: () => import('@/views/ThemeConfigView.vue'),
    },
  ],
});

export default router;
