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
import myAxios from "./plugins/myAxios";
import 'es6-promise/auto';


const route = useRoute();
const store = useUserStore();
const webSocket = ref<WebSocket | null>(null);

const getLayoutClass = (path: string) => {
  const backendPaths = ['/admin', '/writer', '/dashboard', '/management', '/articleEditor'];
  return backendPaths.some(p => path.startsWith(p)) ? 'back-layout' : 'frontend-layout';
};

const appClass = computed(() => {
  return getLayoutClass(route.path);
});

const isLogin = computed(() => {
  const path = route.path;
  return (path.startsWith('/admin') || path.startsWith('/writer') || path === '/user') && !store.isLoggedIn();
});

const connectWebSocket = () => {
  webSocket.value = new WebSocket('ws://localhost:8089/ws');

  webSocket.value.onopen = () => {
    console.log('WebSocket 连接已建立');
  };

  webSocket.value.onmessage = (event) => {
    const notion = JSON.parse(event.data);
    if (!localStorage.getItem('hiddenNotification_' + notion.id)) {
      showNotification(notion);
    }
  };

  webSocket.value.onclose = () => {
    console.log('WebSocket 连接已关闭');
    setTimeout(connectWebSocket, 5000);
  };

  webSocket.value.onerror = (error) => {
    console.error('WebSocket 发生错误:', error);
  };
};

const showNotification = (notion) => {
  Swal.fire({
    title: notion.title,
    text: notion.content,
    icon: 'info',
    showCancelButton: true,
    confirmButtonText: '知道了',
    cancelButtonText: '不再显示',
  }).then((result) => {
    if (result.dismiss === Swal.DismissReason.cancel) {
      localStorage.setItem('hiddenNotification_' + notion.id, 'true');
    }
  });
};

const fetchActiveNotifications = async () => {
  try {
    const response = await myAxios.get('/notion/active');
    const activeNotions = response.data;
    activeNotions.forEach((notion) => {
      if (!localStorage.getItem('hiddenNotification_' + notion.id)) {
        showNotification(notion);
      }
    });
  } catch (error) {
    console.error('获取生效公告失败:', error);
  }
};

onMounted(() => {
  connectWebSocket();
  fetchActiveNotifications();
});

onUnmounted(() => {
  if (webSocket.value) {
    webSocket.value.close();
  }
});
</script>

<style scoped>
#app {
  margin: 0 auto;
  height: 100vh;
}

.frontend-layout {
  max-width: 80vw;
  margin: 0 auto;
}

.back-layout {
  max-width: 100vw;
}

::-webkit-scrollbar {
  width: 12px;
  height: 12px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 6px;
}

::-webkit-scrollbar-thumb {
  background: #007bff;
  border-radius: 6px;
  border: 3px solid #f1f1f1;
}

::-webkit-scrollbar-thumb:hover {
  background: #0056b3;
}

.scroller {
  scrollbar-width: thin;
  scrollbar-color: #007bff #f1f1f1;
}

body {
  -webkit-overflow-scrolling: touch;
}

@media (max-width: 768px) {
  .frontend-layout {
    max-width: 100vw;
  }
}
</style>