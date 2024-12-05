<template>
    <a-layout class="admin-page">
        <!-- 侧边栏 -->
        <a-layout-sider
            class="admin-sider"
            breakpoint="lg"
            :style="{ left: 0 }"
        >
            <!-- Logo 区域 -->
            <div class="logo">管理员系统</div>

            <!-- 菜单 -->
            <a-menu
                v-model:selectedKeys="selectedKeys"
                mode="inline"
                theme="dark"
                @select="handleSelect"
            >
                <a-menu-item key="dashboard">
                    <user-outlined />
                    <span>系统首页</span>
                </a-menu-item>

                <a-sub-menu key="articles-management">
                    <template #title>
                        <upload-outlined />
                        <span>文章管理</span>
                    </template>
                    <a-menu-item key="carousel">轮播新闻</a-menu-item>
                    <a-menu-item key="categories">分类管理</a-menu-item>
                    <a-menu-item key="newsManage">新闻管理</a-menu-item>
                    <a-menu-item key="notionManage">通知管理</a-menu-item>
                </a-sub-menu>

                <a-menu-item key="userManage">
                    <user-outlined />
                    <span>用户管理</span>
                </a-menu-item>
            </a-menu>
        </a-layout-sider>

        <!-- 主内容 -->
        <a-layout-content class="admin-content">
            <div class="content-wrapper">
                <router-view />
            </div>
        </a-layout-content>
    </a-layout>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import {
    UploadOutlined,
    UserOutlined,
    VideoCameraOutlined,
} from '@ant-design/icons-vue';
import router from "./../router/index.ts";

const selectedKeys = ref<string[]>([]);

const handleSelect = (info: { key: string }) => {
    //console.log('Selected key:', info.key); // 调试日志
    selectedKeys.value = [info.key];
    router.push('/admin/' + info.key);
};
</script>

<style scoped>
/* 整体布局 */
.admin-page {
    height: 100vh;
}

/* 侧边栏 */
.admin-sider {
    background-color: #001529;
}

.logo {
    height: 64px;
    font-size: 18px;
    font-weight: bold;
    color: white;
    text-align: center;
    line-height: 64px;
    background: rgba(255, 255, 255, 0.2);
    margin-bottom: 16px;
}

/* 主内容 */
.admin-content {
    padding: 24px;
    background-color: #f0f2f5;
    overflow-y: auto;
}

.content-wrapper {
    padding: 24px;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    min-height: 280px;
}

/* 响应式调整 */
@media (max-width: 768px) {
    .admin-content {
        padding: 16px;
    }
    .content-wrapper {
        padding: 16px;
    }
}
</style>
