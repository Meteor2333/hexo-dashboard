import {createRouter, createWebHashHistory} from "vue-router";

const routes = [
    {
        "path": "/login",
        "component": () => import("./views/login/LoginLayout.vue"),
    },
    {
        "path": "/",
        "component": () => import("./views/admin/AdminLayout.vue"),
        "redirect": {"name": "PostList"},
        "children": [
            {
                "path": "post",
                "name": "PostList",
                "component": () => import("./views/admin/pages/PostListPage.vue"),
            },
            {
                "path": "post/add",
                "name": "PostAdd",
                "component": () => import("./views/admin/pages/PostAddPage.vue"),
            },
            {
                "path": "post/:postId",
                "name": "PostDetail",
                "component": () => import("./views/admin/pages/PostDetailPage.vue"),
                "props": true,
            },
            {
                "path": "page",
                "name": "PageList",
                "component": () => import("./views/admin/pages/PageListPage.vue"),
            },
            {
                "path": "page/add",
                "name": "PageAdd",
                "component": () => import("./views/admin/pages/PageAddPage.vue"),
            },
            {
                "path": "page/:pageId",
                "name": "PageDetail",
                "component": () => import("./views/admin/pages/PageDetailPage.vue"),
                "props": true,
            },
            {
                "path": "config",
                "name": "Config",
                "component": () => import("./views/admin/pages/ConfigPage.vue"),
            },
            {
                "path": "themeconfig",
                "name": "ThemeConfig",
                "component": () => import("./views/admin/pages/ThemeConfigPage.vue"),
            },
        ],
    },
    {
        "path": "/:pathMatch(.*)*",
        "component": "<el-empty description=\"Error 404, Page Not Found\" />",
    },
];

const router = createRouter({"history": createWebHashHistory(), routes});
export default router;
