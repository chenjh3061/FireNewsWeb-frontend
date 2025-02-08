<template>
    <a-modal
            :footer="null"
            :visible="modalVisible"
            class="article-modal"
            title="文章详情"
            width="80vw"
            @cancel="closeModal"
            @close="closeModal"
    >
        <div class="article-header">
            <div class="article-avatar">
                <img :src="article?.articleAvatar" alt="文章封面"/>
            </div>
            <div class="article-info">
                <div class="article-title">{{ article?.articleTitle }}</div>
                <div class="article-category">分类：{{
                        mapping["articleCategory"](article).text }}</div>
                <div class="article-author">作者：{{ article?.authorName }}</div>
                <div class="article-time">发布时间：{{ dayjs(article?.createTime).format("YYYY-MM-DD HH:mm") }}</div>
            </div>
        </div>
        <div class="article-desc">{{ article?.articleDesc }}</div>
        <h4>文章内容：</h4>
        <div class="article-content" v-html="purifyHtml(article?.articleContent)"></div>
    </a-modal>
</template>

<script lang="ts" setup>
import {computed, defineEmits, defineProps} from "vue";
import dayjs from "dayjs";
import DOMPurify from "dompurify";
import {fieldMappings} from "../../utils/mapping.js"

const mapping = fieldMappings;

// 定义 props 和 emits
const props = defineProps({
    visible: Boolean, // 父组件传递的 visible
    article: Object, // 父组件传递的文章详情
});
const article = computed(() => props.article);

const emit = defineEmits(["update:visible"]); // 定义用于触发的事件

// 计算属性，用于绑定到 `a-modal` 的 visible
const modalVisible = computed({
    get: () => props.visible,
    set: (value: boolean) => emit("update:visible", value),
});

// 净化 HTML 标签，防止 XSS
const purifyHtml = (html: string | undefined | null) => {
    if (html == null) {
        return ''; // 返回空字符串，避免对未定义或空值进行净化处理
    }
    return DOMPurify.sanitize(html);
};


// 关闭弹窗的方法
const closeModal = () => modalVisible.value = false;
</script>

<style scoped>
.article-modal .ant-modal-content {
    border-radius: 12px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    background-color: #f9f9f9;
    padding: 20px;
}

.article-header {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
}

.article-avatar img {
    width: 80px;
    height: 80px;
    border-radius: 8px;
    object-fit: cover;
    margin-right: 20px;
}

.article-info {
    flex-grow: 1;
}

.article-title {
    font-size: 22px;
    font-weight: 600;
    color: #333;
    margin-bottom: 8px;
}

.article-author,
.article-time {
    font-size: 14px;
    color: #888;
}

.article-desc {
    font-size: 16px;
    color: #555;
    margin-bottom: 20px;
}

h4 {
    font-weight: 600;
    font-size: 18px;
    color: #333;
    margin-bottom: 12px;
}

.article-content {
    font-size: 14px;
    color: #444;
    line-height: 1.6;
    max-height: 500px;
    overflow-y: auto;
    padding: 12px;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.article-content img {
    max-width: 100%;
    border-radius: 8px;
    margin-top: 10px;
    margin-bottom: 20px;
}

/* 自定义关闭按钮样式 */
.ant-modal-close {
    font-size: 20px;
    color: #aaa;
}

.ant-modal-close:hover {
    color: #333;
}

/* 设置 Modal 的标题样式 */
.ant-modal-title {
    font-size: 24px;
    font-weight: 600;
    color: #333;
    margin-bottom: 12px;
}

/* 设置 Modal 弹窗边框和间距 */
.ant-modal-body {
    padding: 20px;
}

.ant-modal-footer {
    display: none; /* 隐藏footer */
}
</style>
