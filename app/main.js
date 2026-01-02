import { createApp } from "vue";
import ElementPlus from "element-plus";
import en from "element-plus/es/locale/lang/en";
import "element-plus/dist/index.css";
import "element-plus/theme-chalk/dark/css-vars.css";
import App from "./App.vue";
import router from "./router";

const app = createApp(App);

app.use(router);
app.use(ElementPlus, { "zIndex": 3000, "locale": en });

app.mount("#app");