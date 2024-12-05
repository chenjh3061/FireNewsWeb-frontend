<template>
    <a-layout class="writer-page">
        <a-layout-sider class="writer-sider" width="20%">
            <div class="sider-title">作者管理页面</div>
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
import {ref} from 'vue';
import router from '../../router/index.ts';

// 默认选中菜单项
const selectedKeys = ref([]);

// 处理菜单项选择
const handleSelect = (info: { key: string }) => {
    console.log('Selected key:', info.key); // 调试日志
    selectedKeys.value = [info.key]; // 更新选中项
    router.push('/writer/' + info.key); // 路由跳转
};
</script>

<style scoped>
a-menu {
    min-height: 60vh;
}
/* 整体布局 */
.writer-page {
    min-height: 80vh; /* 占满整个视口高度 */
    background-color: #f0f2f5; /* 页面背景 */
}

/* 侧边栏 */
.writer-sider {
    background-color: #001529; /* 深色背景 */
    box-shadow: 2px 0 8px rgba(0, 0, 0, 0.15); /* 添加阴影 */
    display: flex;
    flex-direction: column;
    padding: 20px 0; /* 上下内边距 */
}

.sider-title {
    color: #ffffff;
    font-size: 20px;
    font-weight: bold;
    text-align: center;
    margin-bottom: 20px; /* 标题和菜单之间间距 */
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
@media screen and (max-width: 768px) {
    .writer-sider {
        width: 200px;
    }
    .writer-content {
        margin: 10px;
        padding: 16px;
    }
}
</style>
