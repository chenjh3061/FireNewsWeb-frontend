import {createApp} from 'vue'
import App from './App.vue'
import router from "./router/index.ts";
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/reset.css';
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

createApp(App).use(router).use(Antd).use(pinia).mount("#app");
