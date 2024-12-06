<template>
    <div class="upload-article-page">
        <h2>上传文章</h2>
        <a-tabs default-active-key="upload" class="upload-tabs">
            <!-- 文件上传选项卡 -->
            <a-tab-pane key="upload" tab="文件上传">
                <a-upload-dragger
                    v-model:fileList="fileList"
                    :multiple="false"
                    accept=".doc,.docx,.md,.txt"
                    action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                    name="file"
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

            <!-- 在线编辑选项卡 -->
            <a-tab-pane key="edit" tab="在线编辑">
                <div class="editor-container">
                    <a-input
                        v-model:value="title"
                        placeholder="请输入文章标题"
                        class="title-input"
                    />
                    <a-textarea
                        v-model:value="content"
                        rows="10"
                        placeholder="在此处编辑您的文章内容..."
                        class="content-editor"
                    />
                    <div class="editor-actions">
                        <a-button type="primary" @click="submitArticle">提交文章</a-button>
                        <a-button type="default" @click="clearEditor">清空内容</a-button>
                    </div>
                </div>
            </a-tab-pane>
        </a-tabs>
    </div>
</template>

<script lang="ts" setup>
import { InboxOutlined } from "@ant-design/icons-vue";
import { ref } from "vue";
import { message, UploadChangeParam } from "ant-design-vue";

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
const title = ref("");
const content = ref("");

// 提交文章
const submitArticle = () => {
    if (!title.value || !content.value) {
        message.error("请填写文章标题和内容后再提交！");
        return;
    }
    message.success("文章提交成功！");
    console.log("提交的文章标题：", title.value);
    console.log("提交的文章内容：", content.value);
    clearEditor();
};

// 清空编辑内容
const clearEditor = () => {
    title.value = "";
    content.value = "";
};
</script>

<style scoped>
.upload-article-page {
    padding: 16px;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    max-width: 800px;
    margin: 20px auto;
}

h2 {
    margin-bottom: 16px;
    font-size: 22px;
    font-weight: bold;
    text-align: center;
}

.upload-tabs {
    margin-top: 16px;
}

.editor-container {
    padding: 16px;
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
