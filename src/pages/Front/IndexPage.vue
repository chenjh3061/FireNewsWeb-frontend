<template>
    <div id="home">
        <a-spin v-if="loadingInstance"  size="large" class="full-screen-loading"/>
            <!-- 顶部搜索框和轮播图部分 -->
            <div class="upper-container">
                <!-- 轮播图部分 -->
                <div class="carousel-container">
                    <a-carousel arrows autoplay class="custom-carousel">
                        <div v-for="(item, index) in carouselNews" :key="index" class="carousel-item">
                            <img v-lazy="item.articleAvatar" alt="Fire" class="carousel-image"/>
                            <div class="carousel-overlay">
                                <div class="carousel-content">
                                    <h3 class="carousel-title">{{ item.articleTitle }}</h3>
                                    <p class="carousel-description">{{ item.articleDesc }}</p>
                                    <a class="carousel-link" @click.prevent="viewNewsDetail(item.id, item)">查看详情</a>
                                </div>
                            </div>
                        </div>
                    </a-carousel>
                </div>
    <!--            <a-button v-allow="'admin'" type="primary" @click="addNews">添加新闻</a-button>-->
                <!-- 搜索栏部分 -->
                <div class="search-container">
                    <a-dropdown >
                        <a-input-search
                            v-model:value="searchParams.text"
                            class="search-bar"
                            enter-button="搜索"
                            placeholder="请输入搜索内容"
                            size="large"
                            @search="onSearch"
                            @focus="showHistory = true"
                            @blur="hideHistory"
                        ></a-input-search>
                        <template #overlay>
                            <a-menu v-if="showHistory && historyStore.history.length"
                                    class="history-dropdown">
                                <span class="history-title">历史搜索</span>
                                <a-menu-item v-for="(history, index) in historyStore.history"
                                             :key="index" @click="selectSearchHistory(history)">
                                    {{ history }}
                                </a-menu-item>
                            </a-menu>
                        </template>
                    </a-dropdown>


                    <!-- 热点新闻榜 -->
                    <div class="hot-news-container">
                        <h2>热点新闻榜</h2>
                        <div class="hot-news-list">
                            <div v-for="(article, index) in hotArticles" :key="index" class="hot-news-item">
                                <h3>{{ article.articleTitle }}</h3>
                                <a class="read-more" @click.prevent="viewNewsDetail(article.articleId, article)">阅读全文</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 主要新闻展示区 -->
            <div class="main-news-container">
                <div class="main-news">
                    <div class="main-news-image">
                        <img v-lazy="mainNews.articleAvatar || 'https://via.placeholder.com/400x200'" alt="Breaking News"/>
                    </div>
                    <div class="main-news-text">
                        <h2>{{ mainNews.articleTitle }}</h2>
                        <p>
                            {{ mainNews.articleDesc }}
                        </p>
                        <a class="read-more" @click.prevent="viewNewsDetail(mainNews.articleId, mainNews)">阅读全文</a>
                    </div>
                </div>
            </div>

            <!-- 次要新闻展示区 -->
            <div class="secondary-news-container">
                <div v-for="(article, index) in secondaryArticles" :key="index" class="news-item">
                    <img v-lazy="article.articleAvatar || 'https://via.placeholder.com/400x200'" alt="新闻封面"
                         class="news-image"/>
                    <div class="news-info">
                        <h3>{{ article.articleTitle }}</h3>
                        <p>{{ article.articleDesc }}</p>
                        <a class="read-more" @click.prevent="viewNewsDetail(article.articleId, article)">阅读全文</a>
                    </div>
                </div>
            </div>
    </div>
</template>

<script setup>
import {onMounted, ref, watch} from 'vue';
import { useArticleStore, useHistoryStore } from "../../store/index";
import { useRouter } from 'vue-router';
import myAxios from "../../plugins/myAxios";
import { loadingInstance } from "../../plugins/myAxios";
import {message} from "ant-design-vue";

watch(loadingInstance, (newVal) => {
    console.log(newVal);
})

const router = useRouter();

// 搜索框的输入数据
const searchParams = ref({
    text: '',
});

const carouselNews = ref([]);

const hotArticles = ref([]);

const mainNews = ref({});

const secondaryArticles = ref([]);

const showHistory = ref(false);
const historyStore = useHistoryStore();

const onSearch = () => {
    if (!searchParams.value.text){
        message.error('请输入搜索内容');
        return;
    }
    useHistoryStore().addSearchHistory(searchParams.value.text);
    router.push({
        path: '/search',
        query: { text: searchParams.value.text },
    });
    searchParams.value.text = '';
};

const selectSearchHistory = (term) => {
    searchParams.value.text = term;
};

const hideHistory = () => {
    setTimeout(() => {
        showHistory.value = false;
    }, 300);
};

const viewNewsDetail = (newsId, newsData) => {
    newsData.articleId = newsId;
    useArticleStore().setSelectedArticle(newsData);
    console.log(newsData);
    router.push({
        path: '/article',
        params: { id: newsId },
    });
};

const getNews = async () => {
    try {
        myAxios.get("/article/getAllArticles").then((res) => {
            if (res.data.code === 0) {
                const sortedArticles = res.data.data.sort((a, b) => new Date(b.createTime) - new Date(a.createTime));
                mainNews.value = sortedArticles[0];
                secondaryArticles.value = sortedArticles.slice(1);
                loadingInstance.value = false;
            } else {
                console.log('获取新闻失败');
                loadingInstance.value = false;
            }
        });
        myAxios.get("/article/getCarouselArticles").then((res) => {
            if (res.data.code === 0) {
                carouselNews.value = res.data.data;
                loadingInstance.value = false;
            } else {
                console.log('获取轮播图新闻失败');
                loadingInstance.value = false;
            }
        });
        myAxios.get("/article/getHotNews").then((res) => {
            if (res.data.code === 0) {
                hotArticles.value = res.data.data.slice(0, 5);
                loadingInstance.value = false;
            } else {
                console.log('获取热点新闻失败');
                loadingInstance.value = false;
            }
        });
    } catch (error) {
        console.log(error);
    }
};

onMounted(() => {
    getNews();
});
</script>

<style scoped>
#home {
    width: 100%;
    background-color: #f8f9fa;
}
.full-screen-loading {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.5); /* 半透明背景 */
    z-index: 9999; /* 确保 loading 层在最上层 */
}
.upper-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
}

.search-container {
    flex-grow: 1;
    max-width: 400px;
    margin-left: 20px;
    position: relative;
}

.search-bar {
    width: 100%;
}

.history-dropdown {
    position: absolute;
    top: 100%; /* 确保它从输入框下方显示 */
    left: 0;
    z-index: 9999; /* 确保它显示在其他元素上面 */
    width: 100%; /* 使下拉菜单宽度与输入框一致 */
    max-height: 300px; /* 限制下拉菜单最大高度 */
    overflow-y: auto; /* 当内容过多时出现滚动条 */
}

.history-title {
    font-size: 16px;
    color: #333;
    padding: 10px;
    margin-bottom: 10px;
    border-bottom: 1px solid #ccc;
}

.carousel-container {
    position: relative;
    max-width: 70%;
    min-width: 30rem;
    margin: 0;
}
.custom-carousel {
  width: 100%;
}

.carousel-item {
    position: relative;
}

.carousel-image {
    width: 100%;
    height: 32rem;
    object-fit: fill;
    border-radius: 8px;
}

.carousel-overlay {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: linear-gradient(to top, rgba(0, 0, 0, 1), rgba(0, 0, 0, 0));
    padding: 20px;
    color: #fff;
    border-radius: 0 0 8px 8px;
}

.carousel-content {
    max-width: 90%;
    margin: 0 auto;
    text-align: left;
}

.carousel-title {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 10px;
}

.carousel-description {
    font-size: 16px;
    line-height: 1.5;
    margin-bottom: 10px;
}

.carousel-link {
    color: #ffd700;
    text-decoration: underline;
}

.carousel-link:hover {
    text-decoration: none;
}

/* 热点新闻榜样式 */
.hot-news-container {
    padding: 20px;
    background-color: #fff;
    margin-top: 1rem;
}

.hot-news-list {
    display: flex;
    flex-direction: column;
}

.hot-news-item {
    padding: 10px;
    margin-bottom: 10px;
    background-color: #f9f9f9;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.read-more {
    color: #007bff;
    text-decoration: none;
}

.read-more:hover {
    text-decoration: underline;
}

/* 主要新闻区域样式 */
.main-news-container {
    display: flex;
    justify-content: center;
    margin-bottom: 10px;
    max-height: 22rem;
}

.main-news {
    display: flex;
    width: 100%;
    max-width: 1200px;
    justify-content: space-between;
    align-items: center;
    background: linear-gradient(135deg, #f5f7fa, #c3cfe2); /* 添加渐变背景色 */
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    border-radius: 16px; /* 圆角增加视觉柔和感 */
    overflow: hidden; /* 确保内容不会超出边界 */
    margin: 20px 0;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.main-news:hover {
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
    transform: translateY(-5px);

}

.main-news-image {
    flex: 1;
    position: relative;
    overflow: hidden;
}

.main-news-image img {
    width: 70%;
    height: auto;
    margin-left: 15%;
    object-fit: fill;
    transition: transform 0.5s ease;
}

.main-news-image img:hover {
    transform: scale(1.05);
}

.main-news-text {
    flex: 1;
    padding: 30px;
    color: #333;
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.main-news-text h2 {
    font-size: 28px; /* 更大字号突出标题 */
    font-weight: bold;
    color: #002b5b; /* 深蓝色标题 */
    margin-bottom: 16px;
}

.main-news-text p {
    font-size: 16px;
    color: #555555;
    line-height: 1.6;
    margin-bottom: 24px;
}

.main-news-text a {
    align-self: flex-start;
    padding: 10px 20px;
    font-size: 14px;
    color: #ffffff;
    background-color: #007bff;
    border-radius: 8px;
    text-decoration: none;
    transition: background-color 0.3s ease;
}

.main-news-text a:hover {
    background-color: #0056b3;
}

.read-more {
    color: #007bff;
    text-decoration: none;
}

.read-more:hover {
    text-decoration: underline;
}

/* 次要新闻区域样式 */
.secondary-news-container {
    column-count: 3;
    column-width: 300px;
    gap: 20px;
    padding: 20px;
}

.news-item {
    background-color: #fff;
    margin-bottom: 10px;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.news-item:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.news-image {
    width: 100%;
    height: 200px;
    object-fit: cover;
    border-radius: 8px;
}

.news-info {
    padding: 16px;
}

.news-info h3 {
    font-size: 18px;
    font-weight: bold;
    color: #333;
    margin-bottom: 10px;
}

.news-info p {
    font-size: 14px;
    color: #666;
    line-height: 1.5;
    margin-bottom: 16px;
}

@media screen and (max-width: 768px) {
    .hot-news-container {
        display: none;
    }
    .custom-carousel {
        height: 40vh;
    }
    .carousel-container {
        width: 100vw;

        .carousel-image {
            height: 100%;
        }
    }
    .search-container {
        display: none;
    }
    .main-news {
        flex-direction: column;
    }
}
</style>
