<template>
    <div id="home">
        <!-- 顶部搜索框 -->
        <div class="search-container">
            <a-input-search
                    v-model:value="searchParams.text"
                    class="search-bar"
                    enter-button="搜索"
                    placeholder="请输入搜索内容"
                    size="large"
                    @search="onSearch"
            />
        </div>

        <!-- 轮播图部分 -->
        <div class="carousel-container">
            <a-carousel arrows autoplay class="custom-carousel">
                <div v-for="(item, index) in carouselNews" :key="index" class="carousel-item">
                    <img :src="item.imgUrl" alt="Fire" class="carousel-image"/>
                    <div class="carousel-overlay">
                        <div class="carousel-content">
                            <h3 class="carousel-title">{{ item.title }}</h3>
                            <p class="carousel-description">{{ item.description }}</p>
                            <a @click.prevent="viewNewsDetail(index, item)" class="carousel-link">查看详情</a>
                        </div>
                    </div>
                </div>
            </a-carousel>
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
import {onMounted, ref} from 'vue';
import {useArticleStore, useHistoryStore} from "../store/index";
import {useRouter} from 'vue-router';
import myAxios from "../plugins/myAxios";  // 导入 Vue Router

const router = useRouter();  // 使用 Vue Router
// 搜索框的输入数据
const searchParams = ref({
    text: '',
});

const carouselNews = ref([
    {
        title: '全国火灾数据统计',
        description: '今年上半年全国发生了超过1000起火灾事故。',
        newsUrl: '#/article',
        imgUrl: 'https://via.placeholder.com/1200x500?text=Fire+Prevention',
    },
    {
        title: '火灾应急预警系统升级',
        description: '新的预警系统将在全国范围内启动，帮助更快应对火灾灾难。',
        newsUrl: '#/article',
        imgUrl: 'https://via.placeholder.com/1200x500?text=Fire+Prevention',
    },
    {
        title: '森林火灾防控加强',
        description: '森林火灾防控政策得到进一步加强，严防火灾蔓延。',
        newsUrl: '#/article',
        imgUrl: 'https://via.placeholder.com/1200x500?text=Fire+Prevention',
    },
]);
// 假设从后端获取到的主要新闻
const mainNews = ref({
    id: '',
    articleTitle: '',
    articleDesc: '',
    articleAvatar: '',
    articleContent: '',
    createTime: '',
});
// 假设我们从后端获取到的文章数据
const secondaryArticles = ref([
    {
        id: 1,
        title: '全国火灾数据统计',
        description: '今年上半年全国发生了超过1000起火灾事故。',
        image: 'https://via.placeholder.com/400x200',
        url: '#',
    },
    {
        id: 2,
        title: '火灾应急预警系统升级',
        description: '新的预警系统将在全国范围内启动，帮助更快应对火灾灾难。',
        image: 'https://via.placeholder.com/400x200',
        url: '#',
    },
    {
        id: 3,
        title: '森林火灾防控加强',
        description: '森林火灾防控政策得到进一步加强，严防火灾蔓延。',
        image: 'https://via.placeholder.com/400x200',
        url: '#',
    },
]);

const onSearch = () => {
    console.log(searchParams.value.text);
    // 在这里处理搜索逻辑，例如通过API请求获取数据
    // 搜索完成后添加搜索记录并清空输入框
    useHistoryStore().addSearchHistory(searchParams.value.text);
    console.log(useHistoryStore().history);
    searchParams.value.text = '';
};

// 点击新闻详情，跳转到新闻详情页面
const viewNewsDetail = (newsId, newsData) => {
    useArticleStore().setSelectedArticle(newsData);
    console.log(newsData)
    router.push({
        path: '/article',
        params: { id: newsId },
    });
};

// 获取新闻数据
const getNews = async () => {
    try {
        // 假设后端接口返回分页新闻
        myAxios.get("/article/getAllArticles").then((res) => {
            if (res.data.code === 0) {
                // 按照时间排序，假设返回的数据有时间字段 `createTime`

                const sortedArticles = res.data.data.sort((a, b) => new Date(b.createTime) - new Date(a.createTime));
                console.log(res.data);
                // 将最新的新闻作为主要新闻，其余作为次要新闻
                mainNews.value = sortedArticles[0];
                secondaryArticles.value = sortedArticles.slice(1);
                console.log("main：", mainNews.value);
                console.log(secondaryArticles);
            } else {
                console.log('获取新闻失败');
            }

        })
    } catch (error) {
        console.log(error);
    }

};

// 初始加载时请求新闻数据
onMounted(() => {
        getNews();
    }
);
</script>

<style scoped>
#home {
    width: 100%;
    background-color: #f8f9fa;
}

.search-container {
    padding: 20px 0;
    text-align: center;
}

.search-bar {
    max-width: 800px;
    margin: 0 auto;
}

/* 轮播图样式 */
.carousel-container {
    position: relative;
    max-width: 1200px;
    margin: 20px auto;
    overflow: hidden;
    border-radius: 8px;
}

.carousel-item {
    position: relative;
    width: 100%;
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
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
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
