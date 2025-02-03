<template>
    <div class="upload-article-page">
        <h2>上传文章</h2>
        <a-tabs v-model:active-key="activeKey" class="upload-tabs">

            <!-- 在线编辑选项卡 -->
            <a-tab-pane key="edit" tab="在线编辑">
                <span>支持从word文档粘贴</span>
                <div class="editor-container">
                    <a-input
                        v-model:value="article.articleTitle"
                        placeholder="请输入文章标题"
                        class="title-input"
                    />
                    <span>请选择文章类别：</span>
                    <a-select class="article-category" v-model:value="article.articleCategory" placeholder="请选择分类">
                        <a-select-option v-for="item in categoryList" :key="item.name" :value="item.id"
                                         @select="() => article.articleCategory = item.id">
                            {{ item.name }}
                        </a-select-option>
                    </a-select>
                    <div class="article-good">
                        <div class="article-desc">
                            <a-textarea v-model:value="article.articleDesc" placeholder="填写文章简介">
                            </a-textarea>
                        </div>
                        <div class="article-avatar">
                            <a-input v-model:value="article.articleAvatar" placeholder="请输入文章封面图片URL" type="url"></a-input>
                            <a-upload
                                :action="uploadUrl"
                                list-type="picture-card"
                                :file-list="fileList"
                                :show-upload-list="false"
                                @change="handleImageChange"
                                :headers="{'token': useUserStore().getToken()}"
                            >
                                <a-button icon="upload">点击上传</a-button>
                            </a-upload>
                            <img class="avatar-preview" :src="article.articleAvatar" alt="图"/>
                        </div>
                    </div>
                    <jodit-editor v-model="article.articleContent" :config="config" />
                    <div class="editor-actions">
                        <a-button type="primary" @click="submitArticle">提交文章</a-button>
                    </div>
                </div>
            </a-tab-pane>

            <!-- 文件上传选项卡 -->
            <a-tab-pane key="upload" tab="文件上传">
                <div class="upload-doc">
                    <a-upload-dragger
                        v-model:fileList="fileList"
                        :multiple="false"
                        accept=".doc,.docx,.md,.txt"
                        action="http://localhost:8089/upload/document"
                        name="file"
                        :style="{ width: '100%',marginBottom: '16px' }"
                        @change="handleChange"
                        @drop="handleDrop"
                        :headers="{
                            'token': useUserStore().getToken()
                        }"
                    >
                        <p class="ant-upload-drag-icon">
                            <inbox-outlined></inbox-outlined>
                        </p>
                        <p class="ant-upload-text">点击或拖动要上传的文件到此处</p>
                        <p class="ant-upload-hint">
                            支持的文件格式：.doc, .docx, .md, .txt。每次上传一个文件。
                        </p>
                    </a-upload-dragger>
                    <div class="document-preview">
<!--                        <div v-html="document">-->

<!--                        </div>-->
                    </div>
                </div>
            </a-tab-pane>
        </a-tabs>
    </div>
</template>

<script lang="ts" setup>
import { InboxOutlined } from "@ant-design/icons-vue";
import {onBeforeUnmount, onMounted, ref, watch} from "vue";
import { message, UploadChangeParam } from "ant-design-vue";
import JoditEditor  from "../../plugins/JoditEditor.vue";
import myAxios from "../../plugins/myAxios";
import {watchEffect} from "vue";
import {useUserStore} from "../../store/index";

// 在线编辑相关状态
const article = ref({
    articleTitle: "",
    articleContent: "",
    articleCategory: "",
    articleDesc: "",
    articleAvatar: "",
    authorId: useUserStore().userInfo.id,
});
const activeKey = ref("edit");

watch(article, (newVal) => {
    console.log("文章内容变化：", newVal);
},{ deep: true })
const categoryList = ref([{
    id: 0,
    name: '新闻报道'
}, {
    id: 1,
    name: '科普文章'
}, {
    id: 2,
    name: '通知'
}
]);
// 编辑器配置
const config = {
    readonly: false, // 只读
    theme: "default",
};
// 文件上传状态
const fileList = ref([]);
const uploadUrl = 'http://localhost:8089/upload/img';
// 处理图片上传
const handleImageChange = (info) => {
    if (info.file.status === 'uploading') {
        // 手动上传文件
        const formData = new FormData();
        formData.append('file', info.file.originFileObj);
        myAxios.post(uploadUrl, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'token': useUserStore().getToken()
            }
        }).then(response => {
            if (response.data.code === 0) {
                article.value.articleAvatar = "http://localhost:8089" + response.data.data;
            } else {
                message.error('上传失败');
            }
        }).catch(error => {
            console.error(error);
            message.error('上传失败');
        });
    }
};
watchEffect(() => {
    console.log(article.value.articleAvatar);
});
// 文件上传事件
const handleChange = (info: UploadChangeParam) => {
    const status = info.file.status;
    if (status !== "uploading") {
        console.log(info.file, info.fileList);
    }
    if (status === "done") {
        message.success(`${info.file.name} 上传成功, 请切换到在线编辑页查看内容.`);
        document.value = info.file.response.data;
        article.value.articleContent = info.file.response.data;
        activeKey.value = "edit";
    } else if (status === "error") {
        message.error(`${info.file.name} 上传失败`);
    }
};
const document = ref()

// 拖拽事件
function handleDrop(e: DragEvent) {
    console.log(e);
}


const title = ref("");
const content = ref("");

// 监听内容变化
watch(content, (newValue) => {
    console.log("内容变化：", newValue);
});

// 提交文章
const submitArticle = () => {
    if (!article.value.articleContent.trim()) {
        message.error("内容不能为空！");
        return;
    }
    if (!article.value.articleCategory) {
        message.error("文章类别不能为空！");
        return;
    }
    if (!article.value.articleDesc.trim()) {
        message.error("文章简介不能为空！");
        return;
    }
    if (!article.value.articleAvatar.trim()) {
        message.error("文章封面图片 URL 不能为空！");
        return;
    }
    if (!article.value.articleContent.trim()) {
        message.error("内容不能为空！");
        return;
    }
    // 发送到后端
    myAxios.post("http://localhost:8089/article/addArticle", article.value)
        .then((response) => {
            message.success(response + "文章提交成功！");
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

.title-input {
    margin-bottom: 16px;
    width: 100%;
    border-radius: 6px;
    padding: 12px;
    font-size: 14px;
    border: 1px solid #ddd;
}
.article-category {
    width: 50%;
}
.article-good {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
}

.article-desc {
    width: 50%;
}

.article-avatar {
    display: flex;
    align-items: center;
    gap: 12px;
}

.article-avatar>a-input {
    width: 200px;
}

.avatar-preview {
    max-width: 150px;
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

a-tabs {
    background-color: #fff;
    border-radius: 8px;
}

a-tab-pane {
    padding: 16px;
    background-color: #fff;
    border-radius: 8px;
}

a-upload-dragger {
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
