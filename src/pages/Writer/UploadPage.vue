<template>
    <div class="upload-article-page">
        <h2>上传文章</h2>
        <a-tabs default-active-key="edit" class="upload-tabs">

            <!-- 在线编辑选项卡 -->
            <a-tab-pane key="edit" tab="在线编辑">
                <span>支持从word文档粘贴，图片插入推荐使用url导入</span>
                <div class="editor-container">
                    <a-input
                        v-model:value="article.articleTitle"
                        placeholder="请输入文章标题"
                        class="title-input"
                    />
                    <a-textarea class="article-desc" v-model:value="article.articleDesc"></a-textarea>
                    <div class="article-avatar">
                        <a-input v-model:value="article.articleAvatar" placeholder="请输入文章封面图片URL"></a-input>
                        <img class="avatar-preview" :src="article.articleAvatar" alt="图"/>
                    </div>
                    <jodit-editor v-model="article.articleContent" :config="config" />
                    <div class="editor-actions">
                        <a-button type="primary" @click="submitArticle">提交文章</a-button>
                    </div>
                </div>
            </a-tab-pane>

            <!-- 文件上传选项卡 -->
            <a-tab-pane key="upload" tab="文件上传">
                <a-upload-dragger
                    v-model:fileList="fileList"
                    :multiple="false"
                    accept=".doc,.docx,.md,.txt"
                    action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                    name="file"
                    :style="{ width: '100%',marginBottom: '16px' }"
                    @change="handleChange"
                    @drop="handleDrop"
                >
                    <p class="ant-upload-drag-icon">
                        <inbox-outlined></inbox-outlined>
                    </p>
                    <p class="ant-upload-text">点击或拖动要上传的文件到此处</p>
                    <p class="ant-upload-hint">
                        支持的文件格式：.doc, .docx, .md, .txt。每次上传一个文件。
                    </p>
                </a-upload-dragger>
            </a-tab-pane>
        </a-tabs>
    </div>
</template>

<script lang="ts" setup>
import { InboxOutlined } from "@ant-design/icons-vue";
import {onBeforeUnmount, onMounted, ref, watch} from "vue";
import { message, UploadChangeParam } from "ant-design-vue";
import JoditEditor  from "../../plugins/JoditEditor.vue";
import axios from "axios";

// 编辑器配置
const config = {
    readonly: false, // 只读
    theme: "default",
};
// 文件上传状态
const fileList = ref([]);

// 文件上传事件
const handleChange = (info: UploadChangeParam) => {
    const status = info.file.status;
    if (status !== "uploading") {
        console.log(info.file, info.fileList);
    }
    if (status === "done") {
        message.success(`${info.file.name} 上传成功`);
    } else if (status === "error") {
        message.error(`${info.file.name} 上传失败`);
    }
};

// 拖拽事件
function handleDrop(e: DragEvent) {
    console.log(e);
}

// 在线编辑相关状态
const article = ref({
    articleTitle: "",
    articleContent: "",
    articleDesc: "",
    articleAvatar: "",
});
const title = ref("");
const content = ref("");

// 监听内容变化
watch(content, (newValue) => {
    console.log("内容变化：", newValue);
});

// 提交文章
const submitArticle = () => {
    if (!content.value || content.value.trim() === "") {
        message.error("内容不能为空！");
        return;
    }
    console.log("文章：", { title: title.value, content: content.value });
    // 发送到后端
    axios.post("/addArticle", { title, content })
        .then((response) => {
            message.success("文章提交成功！");
        })
        .catch((error) => {
            console.error("提交失败：", error);
            message.error("文章提交失败！");
        });
};


// 清空编辑内容
const clearEditor = () => {
    title.value = "";
    content.value = "";
};

</script>

<style scoped>
.upload-article-page {
    padding: 0 40px;
    height: auto;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    margin: 20px auto;
    max-width: 1200px;
}

h2 {
    margin-bottom: 24px;
    font-size: 24px;
    font-weight: bold;
    text-align: center;
    color: #333;
}

.upload-tabs {
    margin-top: 20px;
}

.editor-container {
    padding: 24px;
    min-height: 550px;
    background-color: #fafafa;
    border: 1px solid #d9d9d9;
    border-radius: 8px;
    margin-bottom: 24px;
}

.title-input, .article-desc, .article-avatar input {
    margin-bottom: 16px;
    width: 100%;
    border-radius: 6px;
    padding: 12px;
    font-size: 14px;
    border: 1px solid #ddd;
}

.article-desc {
    min-height: 120px;
    resize: vertical;
}

.article-avatar {
    display: flex;
    align-items: center;
    gap: 12px;
}

.avatar-preview {
    max-width: 100px;
    max-height: 100px;
    border-radius: 6px;
    object-fit: cover;
    border: 1px solid #ddd;
}

.editor-actions {
    display: flex;
    justify-content: flex-end;
    margin-top: 20px;
}

.editor-actions a-button {
    padding: 10px 20px;
    font-size: 16px;
}

.a-tabs {
    background-color: #fff;
    border-radius: 8px;
}

.a-tab-pane {
    padding: 16px;
    background-color: #fff;
    border-radius: 8px;
}

.a-upload-dragger {
    background-color: #f7f7f7;
    border: 2px dashed #ddd;
    border-radius: 8px;
    padding: 24px;
    text-align: center;
    cursor: pointer;
}

.ant-upload-drag-icon {
    font-size: 30px;
    color: #4CAF50;
}

.ant-upload-text {
    margin-top: 10px;
    font-size: 14px;
    color: #666;
}

.ant-upload-hint {
    margin-top: 12px;
    font-size: 12px;
    color: #999;
}


.editor-container {
    padding: 16px;
    min-height: 550px;
    background-color: #fafafa;
    border: 1px solid #d9d9d9;
    border-radius: 8px;
}

.title-input {
    margin-bottom: 12px;
    width: 100%;
}

.content-editor {
    margin-bottom: 16px;
    width: 100%;
}

.editor-actions {
    display: flex;
    justify-content: space-between;
}
</style>
