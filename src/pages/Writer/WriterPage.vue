<template>
    <a-layout class="writer-page">
        <a-layout-sider class="writer-sider" :width="siderWidth">
            <div class="side-title">作者管理页面</div>
            <a-menu
                v-model:selectedKeys="selectedKeys"
                mode="inline"
                theme="dark"
                collapsible
                @select="handleSelect"
            >
                <a-menu-item key="articles">
                    <pie-chart-outlined/>
                    <span>作品管理</span>
                </a-menu-item>
                <a-menu-item key="upload">
                    <file-outlined/>
                    <span>提交文章</span>
                </a-menu-item>
            </a-menu>
        </a-layout-sider >
        <a-layout-content class="writer-content">
            <router-view/>
        </a-layout-content>
    </a-layout>
</template>

<script lang="ts" setup>
import {FileOutlined, PieChartOutlined} from '@ant-design/icons-vue';
import {onMounted, ref} from 'vue';
import router from '../../router/index.ts';

// 默认选中菜单项
const selectedKeys = ref(['articles']);

// 控制侧边栏的宽度
const siderWidth = ref('20%');

// 处理菜单项选择
const handleSelect = (info: { key: string }) => {
    selectedKeys.value = [info.key]; // 更新选中项
    router.push('/writer/' + info.key); // 路由跳转
};

onMounted(() => {
    if (router.currentRoute.value.path === '/writer') {
        selectedKeys.value = ['articles']; // 默认选中菜单项
        router.push('/writer/articles'); // 默认跳转到作品管理页面
    }
})
</script>

<style scoped>
a-menu {
    min-height: 60vh;
}
/* 整体布局 */
.writer-page {
    min-height: 85vh; /* 占满整个视口高度 */
    background-color: #f0f2f5; /* 页面背景 */
}

/* 侧边栏 */
.writer-sider {
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
.writer-content {
    padding: 24px;
    background-color: #ffffff; /* 内容背景 */
    box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.1); /* 内容区域阴影 */
    border-radius: 8px; /* 圆角边框 */
    margin: 20px; /* 内容与页面边缘的间距 */
    overflow-y: auto; /* 允许内容滚动 */
}

/* 响应式调整 */
@media screen and (max-width: 1024px) {
    .writer-sider {
        width: 250px; /* 在较小的屏幕上调整宽度 */
    }
}

@media screen and (max-width: 768px) {
    .writer-sider {
        width: 60vw; /* 使用视口宽度的60% */
    }
    .writer-content {
        margin: 10px;
        padding: 16px;
    }
}

@media screen and (max-width: 480px) {
    .writer-sider {
        width: 80vw; /* 在超小屏幕上使用80%的宽度 */
    }
    .writer-content {
        margin: 5px;
        padding: 12px;
    }
}
</style>
