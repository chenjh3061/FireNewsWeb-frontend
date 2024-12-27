<template>
    <a-float-button-group trigger="hover" type="primary" :style="{ right: '11vw' }" tooltip="功能按键">
        <template #icon>
            <CustomerServiceOutlined />
        </template>
        <a-float-button @click="handleCommentClick">
            <template #icon>
                <CommentOutlined />
            </template>
        </a-float-button>
        <a-float-button tooltip="返回最上方" @click="scrollToTop">
            <template #icon>
                <VerticalAlignTopOutlined />
            </template>
        </a-float-button>
    </a-float-button-group>
</template>

<script lang="ts" setup>
import { CustomerServiceOutlined, CommentOutlined, VerticalAlignTopOutlined } from "@ant-design/icons-vue";

// 返回顶部方法
const scrollToTop = () => {
    window.scrollTo({
        top: 0,
        behavior: "smooth", // 平滑滚动
    });
};

// 评论按钮点击方法（根据需求自行实现）
const handleCommentClick = () => {
    console.log("评论按钮点击");
    // 在这里实现具体功能，比如跳转评论区
};
</script>
<style scoped>
/* 调整 FloatButton 的间距或位置 */
a-float-button-group {
    gap: 16px; /* 按钮之间的间距 */
}

a-float-button {
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1); /* 添加阴影 */
}

/* 修改按钮悬停时的背景颜色 */
a-float-button:hover {
    background-color: #1890ff; /* 修改为你想要的颜色 */
    color: #fff; /* 悬停时字体颜色 */
}
</style>
