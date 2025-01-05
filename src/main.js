import {createApp} from 'vue'
import App from './App.vue'
import router from "./router/index.ts";
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/reset.css';
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import {useUserStore} from "./store/index";
import VueLazyload from "vue-lazyload";

const app = createApp(App);

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

// 注册全局指令
app.directive('allow', {
    mounted(el, binding) {
        const userStore = useUserStore(); // 获取 store 实例
        const role = userStore.userInfo?.userRole || []; // 获取用户角色
        if (!role.includes(binding.value)) {
            el.parentNode && el.parentNode.removeChild(el); // 检查父节点是否存在后移除
        }
    }
});

app.use(pinia).use(router).use(Antd).use(VueLazyload).mount("#app");
