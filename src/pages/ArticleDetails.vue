<template>
    <div class="news-detail">
        <!-- 返回按钮 -->
        <div class="back-button" @click="goBack">
            <a-button type="primary" >
                <template #icon>
                    <StepBackwardOutlined />
                </template>
                返回</a-button>
        </div>

        <!-- 标题栏 -->
        <div class="title-bar">
            <h1 class="article-title">{{ articleData.articleTitle }}</h1>
            <p class="publish-date">{{ formatDate(articleData.createTime) }}</p>
            <!-- 字号调整 -->
            <div class="font-size-control">
                <a-button type="text" @click="adjustFontSize('small')">A-</a-button>
                <a-button type="text" @click="adjustFontSize('large')">A+</a-button>
                <a-button type="text" @click="adjustFontSize('reset')">A</a-button>
            </div>
            <!-- 分享功能 -->
            <div class="share-section">
                <a-tooltip title="分享">
                    <a-icon type="share-alt" style="font-size: 20px; cursor: pointer;" @click="shareArticle" />
                </a-tooltip>
            </div>
        </div>

        <!-- 文章详情 -->

        <div class="news-content" v-html="articleData.articleContent" :style="{ fontSize: fontSize + 'px' }"></div>

        <!-- 评论区 -->
        <div class="comment-section">
            <h2 class="comment-title">评论区</h2>

            <!-- 评论输入框 -->
            <div class="comment-input" v-if="isLoggedIn">
                <a-textarea
                    v-model="newComment"
                    rows="4"
                    placeholder="发表你的评论..."
                    class="comment-textarea"
                />
                <div class="comment-actions">
                    <a-button type="primary" @click="submitComment">发表评论</a-button>
                </div>
            </div>

            <!-- 未登录状态提示 -->
            <div class="comment-not-logged-in" v-else>
                <a-alert message="请登录后发表评论" type="info" show-icon />
            </div>

            <!-- 评论列表 -->
            <div class="comment-list" v-if="comments.length">
                <div
                    v-for="(comment, index) in comments"
                    :key="index"
                    class="comment-item"
                >
                    <div class="comment-author">
                        <span class="author-name">{{ comment.author }}</span>
                        <span class="comment-date">{{ formatDate(comment.date) }}</span>
                    </div>
                    <p class="comment-text">{{ comment.content }}</p>
                </div>
            </div>
            <div class="no-comments" v-else>暂无评论，快来抢沙发吧！</div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useArticleStore, useUserStore } from "../store/index";
import { useRouter } from "vue-router";
import {
    StepBackwardOutlined,
    ShareAltOutlined,
} from "@ant-design/icons-vue";

// 获取路由和文章数据
const router = useRouter();
const articleStore = useArticleStore();
const userStore = useUserStore();

const articleData = ref(articleStore.getSelectedArticle());
const isLoggedIn = computed(() => userStore.isLoggedIn); // 检查用户是否已登录

// 评论功能
const comments = ref([
    // 示例数据
    { author: "张三", content: "这是一个很棒的文章！", date: "2024-12-18" },
    { author: "李四", content: "内容很有帮助，谢谢！", date: "2024-12-18" },
]);
const newComment = ref("");

// 字号调整功能
const fontSize = ref(16);
const adjustFontSize = (size: "small" | "large" | "reset") => {
    const sizes = { small: 14, large: 20, reset: 16 };
    fontSize.value = sizes[size];
};

// 格式化日期
const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
};

// 返回上一个页面
const goBack = () => {
    router.back();
};

// 提交评论
const submitComment = () => {
    if (newComment.value.trim() === "") {
        return; // 评论为空不提交
    }
    comments.value.push({
        author: userStore.username, // 用户名从 Store 获取
        content: newComment.value,
        date: new Date().toISOString(),
    });
    newComment.value = ""; // 清空输入框
};

// 分享功能
const shareArticle = () => {
    const shareUrl = window.location.href; // 获取当前页面 URL
    navigator.clipboard.writeText(shareUrl).then(() => {
        alert("文章链接已复制到剪贴板！");
    });
};
</script>

<style scoped>
.news-detail {
    padding: 20px 40px;
    max-width: 800px;
    margin: 0 auto;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.back-button {
    margin-bottom: 20px;
}

.title-bar {
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
}
.font-size-control {
    display: inline;
}
.font-size-control a-button {
    font-size: 16px;
    margin-right: 10px;
}

.article-title {
    display: block;
    font-size: 28px;
    font-weight: bold;
    color: #333;
    margin-bottom: 10px;
}

.publish-date {
    font-size: 14px;
    color: #888;
    margin-bottom: 20px;
}

.news-content {
    font-size: 16px;
    line-height: 1.8;
    color: #333;
    margin-bottom: 40px;
}

.comment-section {
    margin-top: 40px;
}

.comment-title {
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 20px;
    border-bottom: 2px solid #007bff;
    padding-bottom: 8px;
}

.comment-input {
    margin-bottom: 20px;
}

.comment-textarea {
    width: 100%;
    border-radius: 4px;
    resize: none;
}

.comment-actions {
    text-align: right;
    margin-top: 10px;
}

.comment-list {
    margin-top: 20px;
}

.comment-item {
    margin-bottom: 20px;
    padding-bottom: 10px;
    border-bottom: 1px solid #eee;
}

.comment-author {
    display: flex;
    justify-content: space-between;
    font-size: 14px;
    color: #666;
    margin-bottom: 5px;
}

.author-name {
    font-weight: bold;
    color: #007bff;
}

.comment-text {
    font-size: 16px;
    color: #333;
    line-height: 1.6;
}

.no-comments {
    text-align: center;
    color: #999;
    margin-top: 20px;
}

.share-section a-icon {
    color: #007bff;
}
</style>
