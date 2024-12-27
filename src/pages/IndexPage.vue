<template>
    <div id="home">
        <!-- 顶部搜索框和轮播图部分 -->
        <div class="upper-container">
            <!-- 轮播图部分 -->
            <div class="carousel-container">
                <a-carousel arrows autoplay class="custom-carousel">
                    <div v-for="(item, index) in carouselNews" :key="index" class="carousel-item">
                        <img :src="item.imgUrl" alt="Fire" class="carousel-image"/>
                        <div class="carousel-overlay">
                            <div class="carousel-content">
                                <h3 class="carousel-title">{{ item.articleTitle }}</h3>
                                <p class="carousel-description">{{ item.articleDesc }}</p>
                                <a class="carousel-link" @click.prevent="viewNewsDetail(index, item)">查看详情</a>
                            </div>
                        </div>
                    </div>
                </a-carousel>
            </div>

            <!-- 搜索栏部分 -->
            <div class="search-container">
                <a-input-search
                    v-model:value="searchParams.text"
                    class="search-bar"
                    enter-button="搜索"
                    placeholder="请输入搜索内容"
                    size="large"
                    @search="onSearch"
                />
                <!-- 热点新闻榜 -->
                <div class="hot-news-container">
                    <h2>热点新闻榜</h2>
                    <div class="hot-news-list">
                        <div v-for="(article, index) in secondaryArticles" :key="index" class="hot-news-item">
                            <h3>{{ article.articleTitle }}</h3>
                            <a class="read-more" @click.prevent="viewNewsDetail(article.id, article)">阅读全文</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>



        <!-- 主要新闻展示区 -->
        <div class="main-news-container">
            <div class="main-news">
                <div class="main-news-image">
                    <img :src="mainNews.articleAvatar || 'https://via.placeholder.com/400x200'" alt="Breaking News"/>
                </div>
                <div class="main-news-text">
                    <h2>{{ mainNews.articleTitle }}</h2>
                    <p>
                        {{ mainNews.articleDesc }}
                    </p>
                    <a class="read-more" @click.prevent="viewNewsDetail(mainNews.id, mainNews)">阅读全文</a>
                </div>
            </div>
        </div>

        <!-- 次要新闻展示区 -->
        <div class="secondary-news-container">
            <div v-for="(article, index) in secondaryArticles" :key="index" class="news-item">
                <img :src="article.articleAvatar || 'https://via.placeholder.com/400x200'" alt="新闻封面"
                     class="news-image"/>
                <div class="news-info">
                    <h3>{{ article.articleTitle }}</h3>
                    <p>{{ article.articleDesc }}</p>
                    <a class="read-more" @click.prevent="viewNewsDetail(article.id, article)">阅读全文</a>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useArticleStore, useHistoryStore } from "../store/index";
import { useRouter } from 'vue-router';
import myAxios from "../plugins/myAxios";

const router = useRouter();

// 搜索框的输入数据
const searchParams = ref({
    text: '',
});

const carouselNews = ref([
    { articleTitle: '全国火灾数据统计', articleDesc: '今年上半年全国发生了超过1000起火灾事故。', createTime: '2023-04-15', newsUrl: '#/article', imgUrl: 'https://via.placeholder.com/1200x500?text=Fire+Prevention' },
    { articleTitle: '火灾应急预警系统升级', articleDesc: '新的预警系统将在全国范围内启动，帮助更快应对火灾灾难。', createTime: '2023-04-15', newsUrl: '#/article', imgUrl: 'https://via.placeholder.com/1200x500?text=Fire+Prevention' },
    { articleTitle: '森林火灾防控加强', articleDesc: '森林火灾防控政策得到进一步加强，严防火灾蔓延。', createTime: '2023-04-15', newsUrl: '#/article', imgUrl: 'https://via.placeholder.com/1200x500?text=Fire+Prevention' },
]);

const mainNews = ref({
    id: '',
    articleTitle: '',
    articleDesc: '',
    articleAvatar: '',
    articleContent: '',
    createTime: '',
});

const secondaryArticles = ref([
    { id: 1, articleTitle: '全国火灾数据统计', articleDesc: '今年上半年全国发生了超过1000起火灾事故。', image: 'https://via.placeholder.com/400x200', url: '#' },
    { id: 2, articleTitle: '火灾应急预警系统升级', articleDesc: '新的预警系统将在全国范围内启动，帮助更快应对火灾灾难。', image: 'https://via.placeholder.com/400x200', url: '#' },
    { id: 3, articleTitle: '森林火灾防控加强', articleDesc: '森林火灾防控政策得到进一步加强，严防火灾蔓延。', image: 'https://via.placeholder.com/400x200', url: '#' },
    { id: 4, articleTitle: '城市火灾预防指南', articleDesc: '提供实用的防火建议和逃生技巧。', image: 'https://via.placeholder.com/', url: '#'},
    { id: 5, articleTitle: '火灾后的重建与恢复', articleDesc: '探讨如何在火灾后进行有效的社区和建筑重建。', image: 'https://via.placeholder.com/400x200', url: '#' },
]);

const onSearch = () => {
    console.log(searchParams.value.text);
    useHistoryStore().addSearchHistory(searchParams.value.text);
    console.log(useHistoryStore().history);
    searchParams.value.text = '';
};

const viewNewsDetail = (newsId, newsData) => {
    useArticleStore().setSelectedArticle(newsData);
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
                //secondaryArticles.value = sortedArticles.slice(1);
            } else {
                console.log('获取新闻失败');
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
}

.search-bar {
    width: 100%;
}

.carousel-container {
    position: relative;
    max-width: 1000px;
    min-width: 300px;
    margin: 0;
}

.carousel-item {
    position: relative;
}

.carousel-image {
    width: 100%;
    height: 500px;
    object-fit: cover;
    border-radius: 8px;
}

.carousel-overlay {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: linear-gradient(to top, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0));
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
    margin-top: 30px;
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
    margin-bottom: 40px;
}

.main-news {
    display: flex;
    width: 100%;
    max-width: 1200px;
    justify-content: space-between;
    background-color: #fff;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
}

.main-news-image img {
    width: 50%;
    height: auto;
    border-radius: 8px;
}

.main-news-text {
    padding: 20px;
    width: 45%;
}

.main-news-text h2 {
    font-size: 24px;
    font-weight: bold;
    color: #333;
}

.main-news-text p {
    font-size: 16px;
    color: #666;
    margin-top: 10px;
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
    .main-news {
        flex-direction: column;
    }
}
</style>
