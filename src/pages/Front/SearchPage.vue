<template>
    <div id="search-page">
        <!-- 返回首页按钮 -->
        <div class="back-to-home">
            <a-button @click="goHome" type="primary">
                <template #icon><left-outlined /></template>
                返回首页
            </a-button>
        </div>

        <!-- 搜索框和搜索结果 -->
        <div class="search-container">
            <a-input-search v-model:value="searchParams.text" class="search-bar" enter-button="搜索" placeholder="请输入搜索内容"
                size="large" @search="onSearch" />
            <div v-if="searchResults.length > 0" class="search-results">
                <h2>搜索结果</h2>
                <div class="result-item" v-for="(article, index) in searchResults" :key="index">
                    <div class="result-item-header">
                        <h3>{{ article.articleTitle }}</h3>
                        <a class="read-more" @click.prevent="viewNewsDetail(article.id, article)">阅读全文</a>
                    </div>
                    <span>{{ article.articleDesc }}</span>
                </div>
            </div>
            <div v-else class="no-results">
                <p>没有找到相关结果，请尝试其他搜索关键词。</p>
            </div>
            <div class="pagination-wrapper">
                <a-pagination
                    class="pagination"
                    :current="currentPage"
                    :total="total"
                    :page-size="pageSize"
                    show-size-changer
                    responsive
                    @change="onPageChange"
                    @showSizeChange="onPageSizeChange"
                    :show-total="total => `共搜索到 ${total} 条内容`"
                />
            </div>
        </div>
        
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { LeftOutlined } from '@ant-design/icons-vue';
import myAxios from "../../plugins/myAxios";
import { useArticleStore, useHistoryStore } from "../../store/index";

const router = useRouter();
const route = useRoute();

// 搜索框的输入数据
const searchParams = ref({
    text: route.query.text || '', // 从路由查询参数获取搜索内容
});
console.log(searchParams);
const searchResults = ref([]);
const history = useHistoryStore();

const currentPage = ref(0); // 当前页码，默认为第 1 页
const pageSize = ref(20); // 每页显示的记录数
const total = ref(0); // 总记录数

// 根据查询参数进行搜索
const onSearch = async () => {
    if (!searchParams.value.text.trim()) {
        message.warning('请输入搜索内容');
        return;
    }

    const query = (searchParams.value.text.trim());

    try {
        const res = await myAxios.get(`/article/searchArticle`, {
            params: {
                searchParams: query,
                page: currentPage.value,
                size: pageSize.value
            }
        });

        if (res.data?.code === 0 && Array.isArray(res.data.data)) {
            searchResults.value = res.data.data;
            total.value = res.data.message || 0;
            useHistoryStore().addSearchHistory(searchParams.value.text);
        } else {
            searchResults.value = [];
            total.value = 0;
            message.error('搜索失败');
        }
    } catch (error) {
        console.error('搜索失败', error);
        message.error('请求失败，请检查网络');
    }
};

const onPageChange = (page) => {
    currentPage.value = page;
    onSearch(); // 重新请求数据
};

const onPageSizeChange = (current, size) => {
    pageSize.value = size;
    currentPage.value = 1; // 切换每页数量时重置页码
    onSearch();
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
    min-height: 70vh;
    background-color: #f8f9fa;
    padding: 20px;
    font-family: Arial, sans-serif;
}

.back-to-home {
    display: inline;
    margin-bottom: 20px;
}

.search-container {
    max-width: 800px;
    display: grid;
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

.pagination-wrapper {
  place-self: end; /* 将分页组件定位到右下角 */
  margin-right: 20px; /* 距离右侧 20px */
  margin-bottom: 20px; /* 距离底部 20px */
}

.no-results {
    padding: 20px;
    min-height: 600px;
    background-color: #fff;
    margin-top: 20px;
    text-align: center;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    display: flex;
    /* 设置为 Flexbox 布局 */
    flex-direction: column;
    /* 垂直排列子元素 */
    justify-content: center;
    /* 垂直居中 */
    align-items: center;
    /* 水平居中 */
}

.no-results p {
    font-size: 16px;
    color: #888;
    justify-content: center;
    align-items: center;
}
</style>
