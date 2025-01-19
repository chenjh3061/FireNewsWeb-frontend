<template>
    <div id="search-page">
        <!-- 返回首页按钮 -->
        <div class="back-to-home">
            <a-button @click="goHome" type="primary" >
                <template #icon><left-outlined /></template>
                返回首页
            </a-button>
        </div>

        <!-- 搜索框和搜索结果 -->
        <div class="search-container">
            <a-input-search
                v-model:value="searchParams.text"
                class="search-bar"
                enter-button="搜索"
                placeholder="请输入搜索内容"
                size="large"
                @search="onSearch"
            />
            <div v-if="searchResults.length > 0" class="search-results">
                <h2>搜索结果</h2>
                <div class="result-item" v-for="(article, index) in searchResults" :key="index">
                    <div class="result-item-header">
                        <h3>{{ article.articleTitle }}</h3>
                        <a class="read-more" @click.prevent="viewNewsDetail(article.id, article)">阅读全文</a>
                    </div>
                    <p>{{ article.articleDesc }}</p>
                </div>
            </div>
            <div v-else class="no-results">
                <p>没有找到相关结果，请尝试其他搜索关键词。</p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { LeftOutlined } from '@ant-design/icons-vue';
import myAxios from "../../plugins/myAxios";
import {useArticleStore, useHistoryStore} from "../../store/index";

const router = useRouter();
const route = useRoute();

// 搜索框的输入数据
const searchParams = ref({
    text: route.query.text || '', // 从路由查询参数获取搜索内容
});
console.log(searchParams);
const searchResults = ref([]);
const history = useHistoryStore();

// 根据查询参数进行搜索
const onSearch = async () => {
    if (searchParams.value.text.trim()) {
        const query = searchParams.value.text.trim();
        try {
            const res = await myAxios.get(`/article/searchArticle?searchParams=${encodeURIComponent(query)}`);
            if (res.data.code === 0) {
                searchResults.value = res.data.data;
                useHistoryStore().addSearchHistory(searchParams.value.text)
            } else {
                searchResults.value = [];
            }
        } catch (error) {
            console.error("搜索失败", error);
        }
    }
};

// 页面加载时进行搜索
onMounted(() => {
    if (searchParams.value.text) {
        onSearch();
    }
});

const goHome = () => {
    router.back();
};

const viewNewsDetail = (newsId, newsData) => {
    useArticleStore().setSelectedArticle(newsData);
    router.push({
        path: '/article',
        params: { id: newsId },
    });
};
</script>

<style scoped>
/* 搜索页面样式 */
#search-page {
    width: 100%;
    background-color: #f8f9fa;
    padding: 20px;
    font-family: Arial, sans-serif;
}

.back-to-home {
    margin-bottom: 20px;
}

.search-container {
    max-width: 800px;
    margin: 0 auto;
    background-color: #fff;
    border-radius: 8px;
    padding: 20px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.search-bar {
    width: 100%;
    margin-bottom: 20px;
}

.search-results {
    margin-top: 20px;
}

.result-item {
    padding: 15px;
    margin-bottom: 10px;
    background-color: #f9f9f9;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.result-item-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.result-item-header h3 {
    font-size: 18px;
    font-weight: bold;
    color: #333;
}

.read-more {
    color: #007bff;
    text-decoration: none;
}

.read-more:hover {
    text-decoration: underline;
}

.no-results {
    padding: 20px;
    background-color: #fff;
    margin-top: 20px;
    text-align: center;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.no-results p {
    font-size: 16px;
    color: #888;
}
</style>
