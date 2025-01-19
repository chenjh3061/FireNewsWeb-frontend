<template>
    <div :class="appClass">
        <GlobalHeader />
        <float-buttons />
        <router-view />
        <GlobalFooter />
    </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import GlobalHeader from './components/layout/GlobalHeader.vue';
import GlobalFooter from './components/layout/GlobalFooter.vue';
import FloatButtons from './plugins/FloatButtons.vue';
import {useUserStore} from "./store/index.js";

const route = useRoute();
const store = useUserStore();

const appClass = computed(() => {
    // 判断当前路由是否是后台页面
    return route.path.startsWith('/admin') || route.path.startsWith('/writer') ? 'back-layout' : 'frontend-layout';
});

const isLogin = computed(() => {
    const path = route.path;
    return (path.startsWith('/admin') || path.startsWith('/writer') || path === '/user') && !store.isLoggedIn();
})
</script>

<style scoped>
#app {
    margin: 0 auto;
    height: 100vh;
}



/* 前端页面设置宽度为80vw */
.frontend-layout {
    max-width: 80vw;
    margin: 0 auto;
}

/* 后台页面设置宽度为100vw */
.back-layout {
    max-width: 100vw;
}

/* Webkit 浏览器自定义滚动条 */
::-webkit-scrollbar {
    width: 12px; /* 滚动条宽度 */
    height: 12px; /* 滚动条高度 */
}

::-webkit-scrollbar-track {
    background: #f1f1f1; /* 滚动条轨道背景色 */
    border-radius: 6px; /* 圆角 */
}

::-webkit-scrollbar-thumb {
    background: #007bff; /* 滚动条颜色 */
    border-radius: 6px; /* 圆角 */
    border: 3px solid #f1f1f1; /* 滚动条与轨道之间的间隙 */
}

::-webkit-scrollbar-thumb:hover {
    background: #0056b3; /* 悬停时滚动条颜色 */
}

/* Firefox 浏览器 */
.scroller {
    scrollbar-width: thin; /* 滚动条宽度 */
    scrollbar-color: #007bff #f1f1f1; /* 滚动条和轨道颜色 */
}

/* MacOS 等系统可能使用隐藏式滚动条 */
body {
    -webkit-overflow-scrolling: touch; /* 启用平滑滚动 */
}
</style>
