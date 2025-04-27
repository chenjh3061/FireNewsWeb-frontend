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
        <div :style="{ fontSize: fontSize + 'px', zoom: scale }" class="news-content" v-html="sanitizedArticleContent"></div>

    </div>

  <AIModal
      v-if="showAiWindow"
      :articleTitle="articleData?.articleTitle"
      :articleContent="articleData?.articleContent"
      :articleId="articleData?.articleId"
      @close="showAiWindow = false"
  />

  <!-- 添加一个按钮来显示AI窗口 -->
  <div
      class="ai-trigger-button"
      :style="{ top: position.top + 'px', left: position.left + 'px' }"
      @mousedown="startDrag"
      @click="showAiWindow = true"
      @hover="handleHover"
  >
    <a-button
        type="primary"
        shape="circle"
        size="large"
        @click="$emit('click')"
    >
      <template #icon>
        <RobotOutlined />
      </template>
    </a-button>
  </div>

  <!-- 评论区 -->
    <div class="comment-section">
        <h2 class="comment-title">评论区</h2>

        <!-- 评论输入框 -->
        <div v-if="isLoggedIn" class="comment-input">
            <a-textarea
                    v-model:value="newComment"
                    class="comment-textarea"
                    placeholder="发表你的评论..."
                    rows="4"
            />
            <div class="comment-actions">
                <a-button type="primary" @click="submitComment" :loading="isCommentSubmitting">
                    发表评论
                </a-button>
            </div>
        </div>

        <!-- 未登录状态提示 -->
        <div v-else class="comment-not-logged-in">
            <a-alert message="请登录后发表评论" show-icon type="info"/>
        </div>

        <!-- 评论列表 -->
        <div v-if="comments.length" class="comment-list">
            <div
                    v-for="(comment, index) in paginatedComments"
                    :key="index"
                    class="comment-item"
            >
                <div class="comment-author">
                    <span class="author-name">
                        <a-avatar :src="comment.userAvatar" icon="user"/>
                        {{ comment.userName }}
                    </span>
                    <span class="comment-date">{{ formatDate(comment.createTime) }}</span>
                </div>
                <p class="comment-text">{{ comment.content }}</p>
                <!--点赞功能-->
                <div class="comment-actions">
                    <button
                        class="like-btn"
                        :class="{ liked: comment.liked }"
                        @click="toggleLike(comment)"
                    >
                        ❤️ {{ comment.likes }}
                    </button>
                </div>
            </div>
            <div class="load-more" v-if="hasMoreComments">
                <a-button type="link" @click="loadMoreComments">加载更多评论</a-button>
            </div>
        </div>
        <div v-else class="no-comments">暂无评论，快来抢沙发吧！</div>
    </div>
</template>


<script lang="ts" setup>
import {computed, nextTick, onMounted, reactive, ref, watchEffect} from "vue";
import {useArticleStore, useUserStore} from "../store/index";
import {useRouter} from "vue-router";
import {StepBackwardOutlined} from "@ant-design/icons-vue";
import myAxios from "../plugins/myAxios";
import DOMPurify from "dompurify";
import {adjustFontSize, formatDate} from '../utils/utils';
import {_} from "lodash";
import {message} from "ant-design-vue";
import AIModal from "../components/modals/AIModal.vue";
import { RobotOutlined } from "@ant-design/icons-vue";

// 添加控制AI窗口显示的变量
const showAiWindow = ref(true);


// 获取路由和文章数据
const router = useRouter();
const articleStore = useArticleStore();
const userStore = useUserStore();

const articleData = ref(articleStore.getSelectedArticle());
const isLoggedIn = computed(() => userStore.userInfo.token); // 检查用户是否已登录

// 处理文章内容
const sanitizedArticleContent = computed(() => {
    const rawHTML = articleData.value.articleContent;
    return DOMPurify.sanitize(rawHTML); // 使用DOMPurify清理HTML
});

// 评论功能
const comments = ref([]);
const newComment = ref();
const isCommentSubmitting = ref(false);
const hasMoreComments = ref(true);
const currentPage = ref(1);
const commentsPerPage = 10;

const paginatedComments = computed(() =>
    comments.value.slice(0, currentPage.value * commentsPerPage)
);

const commentData = ref({
    articleId: articleData.value.articleId,
    userId: userStore.userInfo.id,
    content: newComment.value,
    parentCommentId: null,
});

// AI功能
const isAiWindowCollapsed = ref(true);
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

// 悬停提示功能
const handleHover  = () => {

}

// 获取评论
const getComments = () => {
    const commentData = ref();
    // if (!articleData.value.id) {
    //     console.warn("Article ID is missing");
    //     return;
    // }
    articleData.value = articleStore.getSelectedArticle();
    try {
        myAxios.get("/comments/getCommentsByArticleId", {
            params: { id: articleData.value.articleId },
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

// 提交评论
const submitComment = async () => {
    if (!newComment.value.trim()) {
        message.warn("评论内容不能为空！");
        return; // 评论为空不提交
    }
    isCommentSubmitting.value = true; // 显示加载状态
    try {
        const res = await myAxios.post("/comments/addComment", {
            articleId: articleData.value.articleId,
            userId: userStore?.userInfo.id,
            content: newComment.value.trim(),
        });

        if (res.data.code === 0) {
            message.success("评论提交成功！");
            comments.value.unshift(res.data.data); // 将新评论添加到列表顶部
            newComment.value = ""; // 清空输入框
        } else {
            message.error(`提交评论失败：${res.data.message || "未知错误"}`);
        }
    } catch (err) {
        console.error("提交评论时发生错误：", err);
        message.error("提交评论失败，请稍后重试！");
    } finally {
        isCommentSubmitting.value = false; // 隐藏加载状态
    }
};
// 加载更多评论
const loadMoreComments = async () => {
    try {
        const res = await myAxios.get("/comments/getCommentsByArticleId", {
            params: {
                id: articleData.value.articleId,
                page: currentPage.value + 1,
                size: commentsPerPage,
            },
        });
        if (res.data.code === 0) {
            comments.value.push(...res.data.data);
            currentPage.value++;
            if (res.data.data.length < commentsPerPage) {
                hasMoreComments.value = false; // 没有更多评论
            }
        } else {
            message.error("加载更多评论失败！");
        }
    } catch (err) {
        console.error(err);
        message.error("加载评论时发生错误！");
    }
};

// 点赞功能
// 点赞切换
const toggleLike = (comment) => {
    if (comment.liked) {
        comment.likes--; // 已点赞 -> 取消点赞
    } else {
        comment.likes++; // 未点赞 -> 点赞
    }
    comment.liked = !comment.liked; // 切换状态
};

// 字号调整功能
const fontSize = ref(16);
const scale = ref(1);
const adjustFontSize = (size: "small" | "large" | "reset") => {
    const sizes = {small: 14, large: 20, reset: 16};
    fontSize.value = sizes[size];

    switch (size) {
        case "small":
            scale.value -= 0.1;
            break;
        case "large":
            scale.value += 0.1;
            break;
        case "reset":
            scale.value = 1;
            break;
    }

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
const aiWindowSize = reactive({width: 100, height: 100}); // 控制窗口的初始大小
// const AIUrl = "https://open.bigmodel.cn/api/paas/v4/chat/completions"
// const apiKey = "cd3e9fa7f67988e4c4a87e6adaad7d4f.tXpGrIlHvyIoqIlL"

const position = ref({ top: 20, left: 20 });

let isDragging = false;
let offset = { x: 0, y: 0 };

const startDrag = (e: MouseEvent) => {
  if (e.target instanceof HTMLButtonElement) return;

  isDragging = true;
  offset = {
    x: e.clientX - position.value.left,
    y: e.clientY - position.value.top
  };

  document.addEventListener('mousemove', drag);
  document.addEventListener('mouseup', stopDrag);
};

const drag = (e: MouseEvent) => {
  if (!isDragging) return;

  position.value = {
    left: e.clientX - offset.x,
    top: e.clientY - offset.y
  };
};

const stopDrag = () => {
  isDragging = false;
  document.removeEventListener('mousemove', drag);
  document.removeEventListener('mouseup', stopDrag);
};

// 记录浏览
const recordVisit = () => {
    // 这里可以调用API来记录访问信息，例如：
    myAxios.post("/article/recordArticleView", null, {
        params: {
            articleId: articleData.value.articleId,
            userId: userStore?.userInfo?.id !== null ? userStore?.userInfo?.id : 1
        }
    });

}

// 在组件加载时获取AI总结
onMounted(() => {
    recordVisit();

    getComments();
});
</script>


<style scoped>
.news-detail {
    padding: 20px 40px;
    max-width: 1100px;
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
.ai-trigger-button {
  position: fixed;
  z-index: 1000;
  cursor: move;
  transition: transform 0.2s;
}

.ai-trigger-button:hover {
  transform: scale(1.1);
}

.ant-btn-circle {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
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
    word-break: break-all;
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

    a-avatar {
        margin-right: 10px;
    }
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
.comment-actions {
    display: flex;
    align-items: center;
    justify-content: right;
}
.like-btn {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 14px;
    display: flex;
    align-items: center;
}
.like-btn.liked {
    color: #ff4d4f; /* 点赞后的高亮颜色 */
}
.like-btn:not(.liked) {
    color: #aaa; /* 未点赞的默认颜色 */
}
@media (max-width: 768px) {
    .ai-window {
        display: none;
    }
    .news-detail {
        padding: 20px;
    }
}
</style>

