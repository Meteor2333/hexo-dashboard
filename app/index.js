import {createApp} from "vue";
import ElementPlus from "element-plus";
import zhCn from "element-plus/es/locale/lang/zh-cn";
import "element-plus/dist/index.css";
import App from "./App.vue";
import router from "./router";

import VueCodemirror from "vue-codemirror";
import {basicSetup, EditorView} from "codemirror";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";

const app = createApp(App);

app.use(ElementPlus, {"locale": zhCn});
app.use(router);

app.use(VueCodemirror, {
    "autofocus": false,
    "disabled": false,
    "indentWithTab": true,
    "tabSize": 4,
    "extensions": [basicSetup, EditorView.lineWrapping],
});

app.mount("#app");

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component);
}