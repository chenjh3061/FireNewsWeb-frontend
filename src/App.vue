<template>
    <div :class="appClass">
        <GlobalHeader />
        <float-buttons />
        <router-view />
        <GlobalFooter />
        <div v-if="notification" class="notification">
            <button @click="closeNotification">Close</button>
            <p>{{ notification }}</p>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';
import GlobalHeader from './components/layout/GlobalHeader.vue';
import GlobalFooter from './components/layout/GlobalFooter.vue';
import FloatButtons from './plugins/FloatButtons.vue';
import { useUserStore } from "./store/index.js";
import Swal from 'sweetalert2';

const route = useRoute();
const store = useUserStore();
const notification = ref<string | null>(null);

const appClass = computed(() => {
    // 判断当前路由是否是后台页面
    return route.path.startsWith('/admin') || route.path.startsWith('/writer') ? 'back-layout' : 'frontend-layout';
});

const isLogin = computed(() => {
    const path = route.path;
    return (path.startsWith('/admin') || path.startsWith('/writer') || path === '/user') && !store.isLoggedIn();
});

const showNotification = (msg: string) => {
    notification.value = msg;
    setTimeout(() => {
        closeNotification();
    }, 5000); // 5秒后自动关闭通知
};

const closeNotification = () => {
    notification.value = null;
};

// 模拟从后端获取通知
const fetchNotification = async () => {
    try {
        const response = await fetch('/api/notifications');
        const data = await response.json();
        if (data.message) {
            showNotification(data.message);
        }
    } catch (error) {
        console.error('Error fetching notification:', error);
    }
};

// 在组件挂载时获取通知
fetchNotification();
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

@media (max-width: 768px) {
    .frontend-layout {
        max-width: 100vw; /* 小屏设备下宽度为100% */
    }
}

.notification {
    position: fixed;
    top: 20px;
    right: 20px;
    background-color: #fff;
    border: 1px solid #ccc;
    padding: 10px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    z-index: 1000;
}
</style>
