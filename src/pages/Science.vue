<template>
    <div id="science-page">
        <!-- 页面头部 -->
        <div class="page-header">
            <h1>火灾科普园地</h1>
            <p>这里刊载有关火灾预防、安全常识以及火灾处理等科普文章，帮助您了解火灾防控知识。</p>
        </div>

        <!-- 大图展示区域 -->
        <div class="highlight-section">
            <div v-for="article in articles.slice(0, 1)" :key="article.id" class="highlight-item">
                <img :src="article.coverImage" alt="Article Image" class="highlight-image"/>
                <div class="highlight-content">
                    <h3>{{ article.title }}</h3>
                    <p class="article-meta">发表于: {{ article.date }}</p>
                    <p class="article-summary">{{ article.body }}</p>
                    <a class="read-more" :href="article.url">阅读更多</a>
                </div>
            </div>
        </div>

        <!-- 文章展示部分 -->
        <div class="articles-wrapper">
            <!-- 图文结合布局 -->
            <div v-for="article in articles.slice(1, 4)" :key="article.id" class="article-item">
                <div class="article-image">
                    <img :src="article.coverImage" alt="Article Image"/>
                </div>
                <div class="article-content">
                    <h3>{{ article.title }}</h3>
                    <p class="article-meta">发表于: {{ article.date }}</p>
                    <p class="article-body">{{ article.body }}</p>
                    <div class="article-footer">
                        <a class="read-more" :href="article.url">阅读更多</a>
                    </div>
                </div>
            </div>

            <!-- 简洁列表布局 -->
            <div v-for="article in articles.slice(4, 6)" :key="article.id" class="article-list-item">
                <div class="article-header">
                    <h3>{{ article.title }}</h3>
                    <p class="article-meta">发表于: {{ article.date }}</p>
                </div>
                <div class="article-body">
                    <p>{{ article.body }}</p>
                </div>
                <div class="article-footer">
                    <a class="read-more" :href="article.url">阅读更多</a>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
// 模拟从后端获取的数据，实际开发中可以通过API请求来获取数据
import { ref } from 'vue';

// 假设这些是从后端接口返回的数据
const articles = ref([
    {
        id: 1,
        title: '火灾预防小常识',
        date: '2024-12-01',
        body: '火灾是一种极其危险的灾害，提前了解一些火灾预防常识对减少火灾发生的几率至关重要...',
        coverImage: 'https://via.placeholder.com/800x400?text=Fire+Prevention',
        url: '#'
    },
    {
        id: 2,
        title: '火灾报警系统的重要性',
        date: '2024-12-02',
        body: '火灾报警系统是早期火灾预警的关键，可以在火灾发生时及时报警，挽救生命...',
        coverImage: 'https://via.placeholder.com/600x400?text=Fire+Alarm+System',
        url: '#'
    },
    {
        id: 3,
        title: '灭火器使用指南',
        date: '2024-12-03',
        body: '灭火器是扑灭初起火灾的重要工具，了解其正确使用方法是每个人应具备的基本消防常识...',
        coverImage: 'https://via.placeholder.com/600x400?text=Fire+Extinguisher',
        url: '#'
    },
    {
        id: 4,
        title: '家庭火灾防范措施',
        date: '2024-12-04',
        body: '家庭火灾防范措施至关重要，及时了解并准备必要的灭火工具，能够有效减少灾害损失...',
        coverImage: 'https://via.placeholder.com/600x400?text=Home+Fire+Prevention',
        url: '#'
    },
    {
        id: 5,
        title: '火灾逃生技巧',
        date: '2024-12-05',
        body: '火灾发生时如何有效逃生是每个人都需要知道的常识，正确的逃生方法能大大增加生还几率...',
        coverImage: 'https://via.placeholder.com/600x400?text=Fire+Escape',
        url: '#'
    },
    {
        id: 6,
        title: '公共场所火灾安全',
        date: '2024-12-06',
        body: '在公共场所发生火灾时，掌握火灾安全措施非常重要，大家需要知道如何在紧急情况下保护自己...',
        coverImage: 'https://via.placeholder.com/600x400?text=Public+Fire+Safety',
        url: '#'
    }
]);

</script>

<style scoped>
#science-page {
    font-family: Arial, sans-serif;
    padding: 30px;
    background-color: #f8f9fa;
}

.page-header {
    text-align: center;
    margin-bottom: 40px;
}

.page-header h1 {
    font-size: 36px;
    color: #333;
    margin-bottom: 15px;
}

.page-header p {
    font-size: 16px;
    color: #555;
    max-width: 800px;
    margin: 0 auto;
}

.highlight-section {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 40px;
}

.highlight-item {
    position: relative;
    width: 100%;
    max-width: 1000px;
    overflow: hidden;
    border-radius: 10px;
}

.highlight-image {
    width: 100%;
    height: 400px;
    object-fit: cover;
    border-radius: 10px;
}

.highlight-content {
    position: absolute;
    bottom: 20px;
    left: 20px;
    color: white;
    background-color: rgba(0, 0, 0, 0.5);
    padding: 20px;
    border-radius: 5px;
}

.highlight-content h3 {
    font-size: 30px;
    font-weight: bold;
}

.highlight-content .article-meta {
    font-size: 14px;
    margin-top: 10px;
}

.highlight-content .article-summary {
    font-size: 16px;
    margin-top: 10px;
}

.articles-wrapper {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 30px;
}

.article-item,
.article-list-item {
    background-color: #fff;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s;
}

.article-item:hover,
.article-list-item:hover {
    transform: translateY(-10px);
}

.article-item .article-image img,
.article-list-item .article-image img {
    width: 100%;
    height: 200px;
    object-fit: cover;
    border-radius: 8px;
    margin-bottom: 15px;
}

.article-item .article-content,
.article-list-item .article-body {
    margin-top: 10px;
}

.article-item h3,
.article-list-item h3 {
    font-size: 24px;
    color: #333;
    margin-bottom: 10px;
}

.article-meta {
    font-size: 14px;
    color: #777;
    margin-bottom: 10px;
}

.article-body p {
    font-size: 16px;
    color: #555;
    line-height: 1.6;
    margin-bottom: 15px;
}

.article-footer {
    display: flex;
    justify-content: flex-end;
}

.read-more {
    color: #007bff;
    font-weight: bold;
    text-decoration: none;
}

.read-more:hover {
    text-decoration: underline;
}

/* 响应式设计 */
@media screen and (max-width: 768px) {
    .page-header h1 {
        font-size: 28px;
    }

    .page-header p {
        font-size: 14px;
    }
}
</style>
