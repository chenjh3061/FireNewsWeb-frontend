<template>
  <div :class="appClass">
    <GlobalHeader />
    <float-buttons />
    <router-view />
    <GlobalFooter />
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import GlobalHeader from './components/layout/GlobalHeader.vue';
import GlobalFooter from './components/layout/GlobalFooter.vue';
import FloatButtons from './plugins/FloatButtons.vue';
import { useUserStore } from "./store/index.js";
import Swal from 'sweetalert2';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const route = useRoute();
const store = useUserStore();
const webSocket = ref<WebSocket | null>(null);

const appClass = computed(() => {
  // 判断当前路由是否是后台页面
  return route.path.startsWith('/admin') || route.path.startsWith('/writer') ? 'back-layout' : 'frontend-layout';
});

const isLogin = computed(() => {
  const path = route.path;
  return (path.startsWith('/admin') || path.startsWith('/writer') || path === '/user') && !store.isLoggedIn();
});

const stompClient = ref<Client | null>(null);


const connectWebSocket = () => {
  if (stompClient.value) return; // 避免重复连接

  const socket = new SockJS('http://localhost:8089/ws');
  const client = new Client({
    webSocketFactory: () => socket,
    reconnectDelay: 5000, // 断线重连
  });

  client.onConnect = () => {
    console.log('WebSocket 连接已建立');

    // 订阅通知频道
    client.subscribe('/topic/notifications', (message) => {
      const notion = JSON.parse(message.body);
      if (!localStorage.getItem('hiddenNotification_' + notion.id)) {
        showNotification(notion);
      }
    });
  };

  client.onStompError = (error) => {
    console.error('WebSocket 发生错误:', error);
  };

  client.activate();
  stompClient.value = client;
};


connectWebSocket();

const showNotification = (notion: any) => {
  Swal.fire({
    title: notion.title,
    text: notion.content,
    icon: 'info',
    showCancelButton: true,
    confirmButtonText: '知道了',
    cancelButtonText: '不再显示',
  }).then((result) => {
    if (result.dismiss === Swal.DismissReason.cancel) {
      // 记录不再显示状态到浏览器本地存储
      localStorage.setItem('hiddenNotification_' + notion.id, 'true');
    }
  });
};

onMounted(() => {
  connectWebSocket();
});

onUnmounted(() => {
  if (stompClient.value) {
    stompClient.value.deactivate();
    stompClient.value = null;
  }
});

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
</style>