<template>
    <div class="carousel-news-management">
        <h2>新闻轮播管理</h2>

        <!-- 已选轮播新闻 -->
        <div class="selected-news">
            <h3>已选择的轮播新闻</h3>
            <a-table :data-source="selectedNews" bordered :pagination="{ pageSize: 5 }">
                <template #render-item="{ item }">
                    <div class="news-item">
                        <span>{{ item.title }}</span>
                        <a-button
                            type="link"
                            @click="removeFromCarousel(item)"
                            class="remove-button"
                        >
                            移除
                        </a-button>
                    </div>
                </template>
            </a-table>
        </div>

        <!-- 可选新闻 -->
        <div class="news-list">
            <h3>可添加到轮播的新闻</h3>
            <a-table :data-source="newsList" bordered :pagination="{ pageSize: 10 }">
                <template #render-item="{ item }">
                    <div class="news-item">
                        <span>{{ item.title }}</span>
                        <a-button
                            type="link"
                            @click="addToCarousel(item)"
                            class="add-button"
                        >
                            添加到轮播
                        </a-button>
                    </div>
                </template>
            </a-table>
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

const selectedNews = ref<News[]>(newsList.value);

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
</script>

<style scoped>
.carousel-news-management {
    max-width: 900px;
    margin: 20px auto;
    background-color: #fff;
    padding: 20px;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

h2 {
    text-align: center;
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 20px;
}

h3 {
    font-size: 18px;
    font-weight: bold;
    color: #333;
    margin-bottom: 12px;
}

.news-list,
.selected-news {
    margin-bottom: 40px;
}

.news-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px;
    background: #f9f9f9;
    border-radius: 8px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
    transition: background 0.3s;
}

.news-item:hover {
    background: #f1f1f1;
}

a-button {
    color: #0078d4;
    font-size: 14px;
    transition: color 0.3s;
}

a-button:hover {
    color: #005a99;
}

.remove-button,
.add-button {
    font-size: 14px;
    background: #ff4d4f;
    color: #fff;
    border-radius: 6px;
    padding: 6px 12px;
    transition: background 0.3s, transform 0.3s;
}

.remove-button:hover,
.add-button:hover {
    background: #d9363e;
    transform: translateY(-2px);
}

/* 针对表格的整体外观 */
.a-table {
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.a-table th {
    background: #f7f7f7;
    color: #333;
}

.a-table td {
    font-size: 14px;
    color: #555;
}
</style>
