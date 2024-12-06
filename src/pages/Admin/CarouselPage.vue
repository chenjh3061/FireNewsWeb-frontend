<template>
    <div class="carousel-news-management">
        <h2>轮播新闻管理</h2>
        <div class="selected-news">
            <h3>已选轮播新闻（{{ selectedNews.length }}/5）</h3>
            <a-list
                    :data-source="selectedNews"
                    bordered
                    render-item="news => renderSelectedNews(news)"
            />
        </div>
        <div class="news-list">
            <h3>新闻列表</h3>
            <a-list
                    :data-source="newsList"
                    bordered
                    render-item="news => renderNewsItem(news)"
                    pagination="{ pageSize: 10 }"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { message } from "ant-design-vue";

interface News {
    id: number;
    title: string;
}

// 示例新闻数据
const newsList = ref<News[]>([
    { id: 1, title: "火灾新闻1" },
    { id: 2, title: "火灾新闻2" },
    { id: 3, title: "火灾新闻3" },
    { id: 4, title: "火灾新闻4" },
    { id: 5, title: "火灾新闻5" },
    { id: 6, title: "火灾新闻6" },
]);

const selectedNews = ref<News[]>([newsList.value[0]]);

// 添加到轮播新闻
const addToCarousel = (news: News) => {
    if (selectedNews.value.length >= 5) {
        message.warning("最多只能选择5条轮播新闻！");
        return;
    }
    if (selectedNews.value.some((n) => n.id === news.id)) {
        message.warning("该新闻已在轮播中！");
        return;
    }
    selectedNews.value.push(news);
    message.success("新闻添加到轮播成功！");
};

// 从轮播新闻移除
const removeFromCarousel = (news: News) => {
    selectedNews.value = selectedNews.value.filter((n) => n.id !== news.id);
    message.success("新闻已从轮播中移除！");
};

// 渲染单条新闻项


// 渲染已选轮播新闻

</script>

<style scoped>
.carousel-news-management {
    max-width: 800px;
    margin: 20px auto;
    background-color: #fff;
    padding: 16px;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

h2 {
    text-align: center;
    margin-bottom: 16px;
}

.news-list,
.selected-news {
    margin-bottom: 24px;
}

.news-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
</style>
