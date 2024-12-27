<template>
    <div class="news-detail">
        <!-- 返回按钮 -->
        <div class="back-button" @click="goBack">
            <a-button type="primary">
                <template #icon>
                    <StepBackwardOutlined />
                </template>
                返回
            </a-button>
        </div>

        <!-- 标题栏 -->
        <div class="title-bar">
            <h1 class="article-title">{{ articleData.articleTitle }}</h1>
            <p class="publish-date">{{ formatDate(articleData.createTime) }}</p>
            <!-- 字号调整 -->
            <div class="font-size-control">
                <a-button type="text" @click="adjustFontSize('small')">A-小字体</a-button>
                <a-button type="text" @click="adjustFontSize('large')">A+大字体</a-button>
                <a-button type="text" @click="adjustFontSize('reset')">A恢复字号</a-button>
            </div>
            <!-- 分享功能 -->
            <div class="share-section">
                <a-tooltip title="分享">
                    <a-icon style="font-size: 20px; cursor: pointer;" type="share-alt" @click="shareArticle"/>
                </a-tooltip>
            </div>
        </div>

        <!-- 文章详情 -->
        <div :style="{ fontSize: fontSize + 'px' }" class="news-content" v-html="articleData.articleContent"></div>

        <!-- 可拖动、可折叠的AI总结与提问窗口 -->
        <div
            class="ai-window"
            :style="{ top: aiWindowPosition.top + 'px', left: aiWindowPosition.left + 'px' }"
            v-show="isAiWindowVisible"
            ref="aiWindow"
            @mousedown="startDrag"
            @mouseup="stopDrag"
        >
            <div class="ai-header">
                <span>AI总结与提问</span>
                <a-icon type="minus" @click="toggleAiWindow" />
            </div>

            <div class="ai-content">
                <h2>AI总结</h2>
                <p>{{ aiSummary }}</p>

                <div class="question-section">
                    <h3>提问AI</h3>
                    <a-input
                        v-model="userQuestion"
                        placeholder="请输入您的问题"
                        @pressEnter="askQuestion"
                        allow-clear
                    />
                    <a-button type="primary" @click="askQuestion">提问</a-button>
                </div>

                <div v-if="aiAnswer" class="ai-answer">
                    <h3>AI回答</h3>
                    <p>{{ aiAnswer }}</p>
                </div>
            </div>
        </div>

        <!-- 评论区 -->
        <div class="comment-section">
            <h2 class="comment-title">评论区</h2>

            <!-- 评论输入框 -->
            <div v-if="isLoggedIn" class="comment-input">
                <a-textarea
                    v-model="newComment"
                    class="comment-textarea"
                    placeholder="发表你的评论..."
                    rows="4"
                />
                <div class="comment-actions">
                    <a-button type="primary" @click="submitComment">发表评论</a-button>
                </div>
            </div>

            <!-- 未登录状态提示 -->
            <div v-else class="comment-not-logged-in">
                <a-alert message="请登录后发表评论" show-icon type="info"/>
            </div>

            <!-- 评论列表 -->
            <div v-if="comments.length" class="comment-list">
                <div
                    v-for="(comment, index) in comments"
                    :key="index"
                    class="comment-item"
                >
                    <div class="comment-author">
                        <span class="author-name">{{ comment.user }}</span>
                        <span class="comment-date">{{ formatDate(comment.date) }}</span>
                    </div>
                    <p class="comment-text">{{ comment.content }}</p>
                </div>
            </div>
            <div v-else class="no-comments">暂无评论，快来抢沙发吧！</div>
        </div>
    </div>
</template>



<script lang="ts" setup>
import { computed, ref, onMounted, reactive } from "vue";
import { useArticleStore, useUserStore } from "../store/index";
import { useRouter } from "vue-router";
import { StepBackwardOutlined } from "@ant-design/icons-vue";
import myAxios from "../plugins/myAxios";

// 获取路由和文章数据
const router = useRouter();
const articleStore = useArticleStore();
const userStore = useUserStore();

const articleData = ref(articleStore.getSelectedArticle());
const isLoggedIn = computed(() => userStore); // 检查用户是否已登录

// 评论功能
const comments = ref([
    { user: "张三", content: "这是一个很棒的文章！", date: "2024-12-18" },
    { user: "李四", content: "内容很有帮助，谢谢！", date: "2024-12-18" },
]);
const newComment = ref([]);

// 获取评论
const getComments = () => {
    const commentData = ref();
    try {
        myAxios.get("/comments/getCommentsByArticleId", {
            params: { articleId: articleData.value.articleId },
        }).then((res) => {
            if (res.data) {
                commentData.value = res.data;
                comments.value.push(...commentData.value);
            } else {
                console.log("获取评论失败！");
            }
        });
    } catch (err) {
        console.error(err);
    }
};

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
    if (newComment.value === "") {
        return; // 评论为空不提交
    }

    newComment.value = null; // 清空输入框
};

// 分享功能
const shareArticle = () => {
    const shareUrl = window.location.href; // 获取当前页面 URL
    navigator.clipboard.writeText(shareUrl).then(() => {
        alert("文章链接已复制到剪贴板！");
    });
};

// AI总结与提问功能
const aiSummary = ref("");
const aiAnswer = ref("");
const userQuestion = ref("");
const isAiWindowVisible = ref(true); // 控制窗口显示与否
const aiWindowPosition = reactive({ top: 200, left: 50 }); // 控制窗口的初始位置
const AIUrl = "https://open.bigmodel.cn/api/paas/v4/chat/completions"
const apiKey = "cd3e9fa7f67988e4c4a87e6adaad7d4f.tXpGrIlHvyIoqIlL"

// 获取文章内容的AI总结
const getAiSummary = async () => {
    try {
        const res = await myAxios.post(
            AIUrl,
            {
                model: "glm-4-flash",
                messages: [
                    {
                        "role": "user",
                        "content": "你是一位记者，需要给出下面文章的总结：" +  articleData.value.articleContent,
                    }
                ]
            },
            {
                headers: {
                    "Authorization": "Bearer " + apiKey,
                    "Content-Type": "application/json"
                }
            }
        );
        aiSummary.value = res.data.choices[0].message.content; // 假设AI返回的摘要字段为summary
        console.log("AI总结：", aiSummary.value.choices[0].message.content);
    } catch (err) {
        console.error("AI总结生成失败", err);
    }
};

// 提问功能
const askQuestion = async () => {
    if (!userQuestion.value.trim()) {
        return; // 如果问题为空，则不发送请求
    }
    console.log("题目：", userQuestion.value); // 输出返回的响应

    try {
        const res = await myAxios.post(
            AIUrl, // 这里的 URL 需要根据你的 API 地址进行调整
            {
                model: "glm-4-flash", // 使用相同的模型
                messages: [
                    {
                        role: "user",
                        content: "你是一位消防记者，帮助回答以下问题：\n问题：" + userQuestion.value + "\n文章内容：" + articleData.value.articleContent
                    }
                ]
            },
            {
                headers: {
                    "Authorization": "Bearer " + apiKey, // 需要添加授权头
                    "Content-Type": "application/json"
                }
            }
        );
        aiAnswer.value = res.data.choices[0].message.content; // 假设返回的结构类似
        console.log("AI回答：", aiAnswer.value); // 输出返回的回答
    } catch (err) {
        console.error("AI回答失败", err);
    }
};


// 拖动窗口的相关操作
let isDragging = false;
let offsetX = 0;
let offsetY = 0;

const startDrag = (e: MouseEvent) => {
    isDragging = true;
    offsetX = e.clientX - aiWindowPosition.left;
    offsetY = e.clientY - aiWindowPosition.top;
    document.addEventListener("mousemove", dragWindow);
    document.addEventListener("mouseup", stopDrag);
};

const dragWindow = (e: MouseEvent) => {
    if (isDragging) {
        aiWindowPosition.left = e.clientX - offsetX;
        aiWindowPosition.top = e.clientY - offsetY;
    }
};

const stopDrag = () => {
    isDragging = false;
    document.removeEventListener("mousemove", dragWindow);
    document.removeEventListener("mouseup", stopDrag);
};

// 控制AI模块的折叠与展开
const toggleAiWindow = () => {
    isAiWindowVisible.value = !isAiWindowVisible.value;
};

// 在组件加载时获取AI总结
onMounted(() => {
    getAiSummary();
});
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
    display: inline-block;
    font-size: 28px;
    font-weight: bold;
    color: #333;
    margin-bottom: 10px;
}

.publish-date {
    display: inline-block;
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
.ai-window {
    position: absolute;
    width: 300px;
    background-color: #ffffff;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    border-radius: 8px;
    z-index: 999;
    cursor: move;
}

.ai-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #f0f2f5;
    padding: 10px;
    border-radius: 8px 8px 0 0;
    font-size: 16px;
    font-weight: bold;
}

.ai-header a-icon {
    cursor: pointer;
}

.ai-content {
    padding: 15px;
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.ai-content h2 {
    font-size: 18px;
    font-weight: bold;
}

.question-section {
    display: flex;
    gap: 10px;
}

.ai-answer {
    background-color: #f9f9f9;
    padding: 10px;
    border-radius: 8px;
}

.ai-answer h3 {
    font-size: 16px;
    font-weight: bold;
}
</style>

