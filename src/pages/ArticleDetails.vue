<template>
    <div class="news-detail">
        <!-- 返回按钮 -->
        <div class="back-button" @click="goBack">
            <a-button type="primary">
                <template #icon>
                    <StepBackwardOutlined/>
                </template>
                返回
            </a-button>
        </div>

        <!-- 标题栏 -->
        <div class="title-bar">
            <h1 class="article-title">{{ articleData?.articleTitle }}</h1><br/>
            <p class="publish-date">{{ formatDate(articleData?.createTime) }}</p>
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
        <div :style="{ fontSize: fontSize + 'px' }" class="news-content" v-html="sanitizedArticleContent"></div>

        <!-- 可拖动、可折叠的AI总结与提问窗口 -->
        <transition name="ai-window-collapse">
        <div
                v-show="isAiWindowVisible"
                ref="aiWindow"
                id="aiWindow"
                :style="{ top: aiWindowPosition.top + 'px', left: aiWindowPosition.left + 'px',
                      width: aiWindowSize.width + 'px', height: aiWindowSize.height + 'px' }"
                class="ai-window"
                :class="{ 'ai-window-collapsed': isAiWindowCollapsed }"
                @mousedown="startDrag"
                @mouseup="stopDrag"
        >
            <div class="ai-header">
                <span>AI总结与提问</span>
                <a-icon type="minus" @click="toggleAiWindow"/>
                <button @click="toggleCollapse">
                    {{ isAiWindowCollapsed ? '展开' : '折叠' }}
                </button>
            </div>

            <div class="ai-content" v-if="!isAiWindowCollapsed">
                <h2>AI总结</h2>
                <div v-if="isAILoading" class="loading">加载中...</div>
                <p v-else>{{ aiSummary }}</p>

                <div class="question-section">
                    <h3>提问AI</h3>
                    <a-input
                            v-model:value="userQuestion"
                            allow-clear
                            placeholder="请输入您的问题"
                            @pressEnter="askQuestion"
                    />
                    <a-button :loading="isAILoading" type="primary" @click="askQuestion">提问</a-button>
                </div>

                <div v-if="aiAnswer" class="ai-answer">
                    <h3>AI回答</h3>
                    <p>{{ aiAnswer }}</p>
                </div>

                <div class="ai-footer">
                    <a-button :loading="isAILoading" type="primary" @click="getAiSummary">获取AI总结</a-button>
                </div>
            </div>
            <!-- 可调节大小的手柄 -->
            <div class="resize-handle top-left" @mousedown="startResize('top-left')"></div>
            <div class="resize-handle top-right" @mousedown="startResize('top-right')"></div>
            <div class="resize-handle bottom-left" @mousedown="startResize('bottom-left')"></div>
            <div class="resize-handle bottom-right" @mousedown="startResize('bottom-right')"></div>
            <div class="resize-handle top" @mousedown="startResize('top')"></div>
            <div class="resize-handle right" @mousedown="startResize('right')"></div>
            <div class="resize-handle bottom" @mousedown="startResize('bottom')"></div>
            <div class="resize-handle left" @mousedown="startResize('left')"></div>
        </div>
        </transition>
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
                    <span class="comment-date">{{ formatDate(comment.createTime) }}</span>
                </div>
                <p class="comment-text">{{ comment.content }}</p>
            </div>
        </div>
        <div v-else class="no-comments">暂无评论，快来抢沙发吧！</div>
    </div>
</template>


<script lang="ts" setup>
import {computed, onMounted, reactive, ref} from "vue";
import {useArticleStore, useUserStore} from "../store/index";
import {useRouter} from "vue-router";
import {StepBackwardOutlined} from "@ant-design/icons-vue";
import myAxios from "../plugins/myAxios";
import DOMPurify from "dompurify";
import {adjustFontSize, formatDate} from '../utils/utils.js';
import {_} from "lodash";


// 获取路由和文章数据
const router = useRouter();
const articleStore = useArticleStore();
const userStore = useUserStore();

const articleData = ref(articleStore.getSelectedArticle());
const isLoggedIn = computed(() => userStore); // 检查用户是否已登录

// 处理文章内容
const sanitizedArticleContent = computed(() => {
    const rawHTML = articleData.value.articleContent;
    return DOMPurify.sanitize(rawHTML); // 使用DOMPurify清理HTML
});

// 评论功能
const comments = ref([]);
const newComment = ref([]);

// AI功能
const isAiWindowCollapsed = ref(false);
const toggleCollapse = () => {
    isAiWindowCollapsed.value = !isAiWindowCollapsed.value;
    if (isAiWindowCollapsed.value === true){
        aiWindowSize.width =  100;
        aiWindowSize.height = 100;
    } else {
        aiWindowSize.width =  350;
        aiWindowSize.height = 350;
    }


};

// 获取评论
const getComments = () => {
    const commentData = ref();
    try {
        myAxios.get("/comments/getCommentsByArticleId",
            {
                params: {
                    id: articleData.value.id,
                },
            }).then((res) => {
            console.log(res);
            if (res.data.code === 0) {
                commentData.value = res.data.data;
                comments.value.push(...commentData.value);
            } else {
                console.log("获取评论失败！");
            }
        });
    } catch (err) {
        console.error(err);
    }
};
getComments();

// 提交评论
const submitComment = () => {
    if (newComment.value === "") {
        return; // 评论为空不提交
    } else {
        try {
            myAxios.post("/comments/addComment", {
                articleId: articleData.value.articleId,
                userId: userStore.userInfo.userName,
                content: newComment.value,
            }).then((res) => {
                if (res.data) {
                    getComments();
                } else {
                    console.log("提交评论失败！");
                }
            });
        } catch (err) {
            console.error(err);
        }
    }

    newComment.value = null; // 清空输入框
};

// 字号调整功能
const fontSize = ref(16);
const adjustFontSize = (size: "small" | "large" | "reset") => {
    const sizes = {small: 14, large: 20, reset: 16};
    fontSize.value = sizes[size];
};

// 返回上一个页面
const goBack = () => {
    router.back();
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
const aiWindowPosition = reactive({top: 200, left: 50}); // 控制窗口的初始位置
const aiWindowSize = reactive({width: 350, height: 350}); // 控制窗口的初始大小
// const AIUrl = "https://open.bigmodel.cn/api/paas/v4/chat/completions"
// const apiKey = "cd3e9fa7f67988e4c4a87e6adaad7d4f.tXpGrIlHvyIoqIlL"

const isAILoading = ref(false); // 控制提问按钮的加载状态

// 获取文章内容的AI总结
const getAiSummary =  _.debounce(async () => {
    try {
        isAILoading.value = true; // 开始加载
        const res = await myAxios.post(
            "/ai/generateSummary",
            {
                "content": "你是一位记者，需要给出下面文章的总结：" +
                    "标题：" + articleData.value.articleTitle + "内容：" + articleData.value.articleContent,
            },
        );
        // 打印完整的返回数据来检查字段
        console.log("AI返回的数据：", res.data);

        // 获取summary字段的内容并提取其中的content
        if (res.data && res.data.data && res.data.data.summary) {
            // 正则表达式提取content字段的内容
            const summaryString = res.data.data.summary;
            const contentMatch = summaryString.match(/content=([^,]+)/);  // 提取"content"后的内容
            if (contentMatch && contentMatch[1]) {
                aiSummary.value = contentMatch[1].trim(); // 获取并去掉前后空白字符
                console.log("AI总结：", aiSummary.value);
            } else {
                console.error("AI总结生成失败: content提取失败", summaryString);
            }
        } else {
            console.error("AI总结生成失败: 返回数据结构不符合预期", res.data);
        }
    } catch (err) {
        console.error("AI总结生成失败", err);
    } finally {
        isAILoading.value = false; // 结束加载
    }
}, 500);


// 提问功能
const askQuestion = _.debounce(async () => {
    if (!userQuestion.value) {
        console.log(userQuestion.value)
        return; // 如果问题为空，则不发送请求
    }
    console.log("题目：", userQuestion.value); // 输出返回的响应

    try {
        isAILoading.value = true; // 开始加载
        const res = await myAxios.post(
            "/ai/askQuestion", // 这里的 URL 需要根据你的 API 地址进行调整
            {
                messages: [
                    {
                        userRole: "user",
                        content: "你是一位消防记者，帮助回答以下问题：\n问题：" + userQuestion.value + "\n文章内容：" + articleData.value.articleContent
                    }
                ]
            },
            {
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );

        aiAnswer.value = res.data.answer.message.content; // 假设返回的结构类似
        isAILoading.value = false; // 结束加载
    } catch (err) {
        console.error("AI回答失败", err);
    } finally {
        isAILoading.value = false; // 结束加载
    }
}, 500);


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

        let left = aiWindowPosition.left;
        let top = aiWindowPosition.top;

        // 吸附到屏幕边缘
        const margin = 20; // 吸附边距
        if (left < margin) left = 0;
        if (top < margin) top = 0;

        aiWindowPosition.left = left;
        aiWindowPosition.top = top;
    }
};

const stopDrag = () => {
    isDragging = false;
    document.removeEventListener("mousemove", dragWindow);
    document.removeEventListener("mouseup", stopDrag);
};

// 窗口大小调整
let resizing = false;
let resizeDirection = "";
let startSize = {width: 0, height: 0};
let startPos = {x: 0, y: 0};

const startResize = (direction: string) => {
    resizing = true;
    resizeDirection = direction;
    startSize = {...aiWindowSize};
    startPos = {x: event.clientX, y: event.clientY};
    document.addEventListener("mousemove", resizeWindow);
    document.addEventListener("mouseup", stopResize);
};

const resizeWindow = (event: MouseEvent) => {
    if (resizing) {
        const dx = event.clientX - startPos.x;
        const dy = event.clientY - startPos.y;
        if (resizeDirection.includes("right")) {
            aiWindowSize.width = startSize.width + dx;
        }
        if (resizeDirection.includes("bottom")) {
            aiWindowSize.height = startSize.height + dy;
        }
        if (resizeDirection === "left") {
            aiWindowSize.width = startSize.width - dx;
        }
        if (resizeDirection === "top") {
            aiWindowSize.height = startSize.height - dy;
        }
    }
};

const stopResize = () => {
    resizing = false;
    document.removeEventListener("mousemove", resizeWindow);
    document.removeEventListener("mouseup", stopResize);
};

// 控制AI模块的折叠与展开
const toggleAiWindow = () => {
    isAiWindowVisible.value = !isAiWindowVisible.value;
};

// 在组件加载时获取AI总结
onMounted(() => {
    // getAiSummary();
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

.resize-handle {
    position: absolute;
    background-color: #ccc;
    cursor: pointer;
}

.font-size-control {
    display: inline;
    margin-left: 30px;
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
    margin: 5rem auto;
    width: 70%;
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
    width: 30rem;
    height: 30rem;
    background-color: #ffffff;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    border-radius: 8px;
    z-index: 999;
    cursor: move;
}

.ai-window-collapsed {
    height: 50px;
    overflow: hidden;
}
.loading {
    color: #999;
    font-style: italic;
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

