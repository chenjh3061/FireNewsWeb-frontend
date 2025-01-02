<template>
    <a-layout class="admin-page">
        <!-- 侧边栏 -->
        <a-layout-sider
            class="admin-sider"
            breakpoint="lg"
            :style="{ left: 0 }"
        >
            <div class="side-title">管理员页面</div>

            <!-- 菜单 -->
            <a-menu
                v-model:selectedKeys="selectedKeys"
                mode="inline"
                theme="dark"
                inline-collapsed
                @select="handleSelect"
            >
                <a-menu-item key="dashboard">
                    <PieChartOutlined />
                    <span>系统首页</span>
                </a-menu-item>

                <a-sub-menu key="articles-management">
                    <template #title>
                        <upload-outlined />
                        <span>文本管理</span>
                    </template>
                    <a-menu-item key="carousel">轮播新闻</a-menu-item>
                    <a-menu-item key="categories">分类管理</a-menu-item>
                    <a-menu-item key="newsManage">文章管理</a-menu-item>
                    <a-menu-item key="notionManage">通知管理</a-menu-item>
                </a-sub-menu>
                <a-menu-item key="commentManage">
                    <CommentOutlined />
                    <span>评论管理</span>
                </a-menu-item>
                <a-menu-item key="userManage">
                    <user-outlined />
                    <span>用户管理</span>
                </a-menu-item>
            </a-menu>
        </a-layout-sider>

        <!-- 主内容 -->
        <a-layout-content class="admin-content">
            <a-breadcrumb class="guide" :routes="router">
                <template #itemRender="{ route, paths }">
                    {{ route.paths }}
                </template>
            </a-breadcrumb>

            <div class="content-wrapper">
                <router-view />
            </div>
        </a-layout-content>
    </a-layout>
</template>

<script lang="ts" setup>
import {onMounted, ref, watch} from 'vue';
import {
    UploadOutlined,
    UserOutlined,
    CommentOutlined,
    PieChartOutlined,
    VideoCameraOutlined,
} from '@ant-design/icons-vue';
import router from "../../router";
import {useRoute} from "vue-router";

const route = useRoute();

const selectedKeys = ref<string[]>(['dashboard']);

const checkRouter = (to: any) => {
    console.log(router)
};

const handleSelect = (info: { key: string }) => {
    //console.log('Selected key:', info.key); // 调试日志
    selectedKeys.value = [info.key];
    router.push('/admin/' + info.key);
};
onMounted(() => {
    // handleSelect({key: 'dashboard'});
    if (router.currentRoute.value.path === '/admin') {
        selectedKeys.value = ['dashboard']; // 默认选中菜单项
        router.push('/admin/dashboard'); // 默认跳转到作品管理页面
    }
});

watch(
    () => route.path, // 监听路由的变化
    (newPath) => {
        const key = newPath.split('/')[2]; // 从路由路径获取菜单项
        selectedKeys.value = [key || 'articles']; // 更新选中项
    },
    { immediate: true } // 初次加载时就执行一次
);
</script>

<style scoped>
/* 整体布局 */
.admin-page {
    min-height: 85vh;
}

/* 侧边栏 */
.admin-sider {
    background-color: #001529;
    box-shadow: 2px 0 8px rgba(0, 0, 0, 0.15); /* 添加阴影 */
    display: flex;
    flex-direction: column;
    padding: 20px 0; /* 上下内边距 */
}

.side-title {
    height: 64px;
    width: 100%;
    font-size: 20px;
    font-weight: bold;
    color: white;
    text-align: center;
    line-height: 64px;
    margin-bottom: 16px;
}

/* 主内容 */
.admin-content {
    background-color: #f0f2f5;
    padding-right: 24px;
    box-shadow: 2px 0 8px rgba(0, 0, 0, 0.15); /* 添加阴影 */
    overflow-x: hidden;
    overflow-y: auto;
}

.content-wrapper {
    padding: 24px;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    min-height: 100%;
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
