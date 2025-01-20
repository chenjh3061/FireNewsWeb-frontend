<template>
    <a-layout class="hotTopicLayout">
        <h1 class="hot-title">热点新闻榜</h1>
        <a-layout-content class="hotTopicContent">
            <a-list :data-source="listData" :pagination="pagination" item-layout="vertical" size="large"
                    :style="{ width: '100%' }">
                <template #footer>
                    <div class="footer-text">
                        <b>组件支持来自 ant design vue</b>
                    </div>
                </template>
                <template #renderItem="{ item, index }">
                    <a-list-item :key="item.articleId" class="news-item">
                        <template #actions>
                            <span v-for="(action, index) in actions" :key="index" class="action">
                                <component :is="action.icon" style="margin-right: 8px" />
                                {{ action.text }}
                            </span>
                        </template>
                        <template #extra>
                            <img
                                alt="logo"
                                :src="item.articleAvatar"
                                class="news-image"
                            />
                        </template>
                        <a-list-item-meta :description="item.articleDesc">
                            <template #title>
                                <a @click.prevent="viewNewsDetail(item)" class="news-title">{{ item.articleTitle }}</a>
                            </template>
                            <template #avatar>
                                <a-avatar :src="item.authorAvatar" />
                                <span class="author-name">{{ item.authorName }}</span>
                            </template>
                        </a-list-item-meta>
                        <p class="content-preview">{{ item.content }}</p>
                    </a-list-item>
                </template>
            </a-list>
        </a-layout-content>
    </a-layout>
</template>

<script lang="ts" setup>
import { LikeOutlined, MessageOutlined, StarOutlined } from '@ant-design/icons-vue';
import { ref, onMounted } from 'vue';
import myAxios from "../../plugins/myAxios";
import { useArticleStore } from "../../store";
import router from "../../router";

// 使用 ref 包装 listData
const listData = ref<any[]>([]);

// 获取热点新闻
const getHotTopics = async () => {
    try {
        const res = await myAxios.get("/article/getHotNews");
        if (res.data.code === 0) {
            listData.value = res.data.data; // 更新响应式数据
            console.log(listData.value);
        } else {
            console.error("获取热点新闻失败");
        }
    } catch (e) {
        console.error(e);
    }
};

// 分页设置
const pagination = {
    onChange: (page: number) => {
        console.log(page);
    },
    pageSize: 10,
};

const viewNewsDetail = (newsData) => {
    useArticleStore().setSelectedArticle(newsData);
    router.push({
        path: '/article',
        params: { id: newsData.articleId },
    });
};

// 设置动作图标
const actions = [
    { icon: LikeOutlined, text: '156' },
    { icon: MessageOutlined, text: '2' },
];

// 页面加载时获取热点新闻
onMounted(() => {
    getHotTopics();
});
</script>

<style scoped>
.hotTopicLayout {
    min-height: 60%;
    width: 85%;
    background: #edf0f6;
    padding: 22px;
    margin: 0 auto;
    align-items: center;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.hot-title {
    font-size: 28px;
    color: #333;
    margin-bottom: 20px;
    font-weight: 600;
    text-align: left;
}

.hotTopicContent {
    width: 100%;
    background: #eecfc9;
    display: flex;
    margin: 0 auto;
    padding: 16px;
    border-radius: 8px;
}

.news-item {
    background-color: rgba(255, 255, 255, 0.5);  /* 半透明效果 */
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
    margin-bottom: 20px;
    padding: 16px;
    position: relative;
    overflow: hidden;
    transition: all 0.3s ease;
}

.news-item:hover {
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
    transform: translateY(-5px);
}

.news-item::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(255, 255, 255, 0.4); /* 半透明灰白色蒙板 */
    transition: all 0.3s ease;
    z-index: -1;
}

/* 使用伪类选择器为奇偶数项设置不同的背景渐变色 */
.news-item:nth-child(even) {
    background: linear-gradient(45deg, rgba(255, 78, 80, 0.7), rgba(249, 212, 35, 0.7)); /* 渐变色透明度调整 */
}

.news-item:nth-child(odd) {
    background: linear-gradient(45deg, rgba(255, 106, 0, 0.7), rgba(238, 9, 121, 0.7)); /* 渐变色透明度调整 */
}

.news-image {
    width: 200px;
    height: 150px;
    object-fit: cover;
    border-radius: 8px;
    margin: 0 0 16px auto;
    transition: transform 0.3s ease;
}

.news-image:hover {
    transform: scale(1.1);
}

.news-title {
    font-size: 20px;
    color: #fff; /* 白色字体 */
    font-weight: 600;
    text-decoration: none;
    transition: color 0.3s ease;
    z-index: 2;
}

.news-title:hover {
    color: #d9534f; /* 鼠标悬停时变色 */
}

.content-preview {
    font-size: 16px;
    color: #fff; /* 白色字体 */
    line-height: 1.6;
    margin-top: 12px;
    z-index: 2;
}

.author-name {
    font-size: 14px;
    color: #fff; /* 白色字体 */
    margin-top: 5px;
}

.action {
    font-size: 14px;
    color: #fff; /* 白色字体 */
    margin-top: 40px;
    margin-right: 16px;
    z-index: 2;
}

.action:hover {
    color: #d9534f; /* 鼠标悬停时变色 */
}

.footer-text {
    text-align: center;
    padding: 20px;
    border-radius: 8px;
    font-size: 14px;
    color: #777;
    background-color: #e1baba;
}

</style>
