<template>
    <div class="article-edit">
        <a-button class="back-button" type="primary" @click="handleBack">返回</a-button>
        <h2 class="edit-title">{{ isEdit ? '修改文章' : '新增文章' }}</h2>

        <a-form :model="articleForm" :label-col="{ span: 4 }" :rules="rules" :wrapper-col="{ span: 14 }">
            <!-- 文章标题 -->
            <a-form-item label="文章标题" name="articleTitle">
                <a-input v-model:value="articleForm.articleTitle" placeholder="请输入标题"/>
            </a-form-item>

            <!-- 文章摘要和封面 -->
            <a-row gutter={24}>
                <!-- 文章摘要 -->
                <a-col :span="12">
                    <a-form-item label="文章摘要" name="articleDesc">
                        <a-textarea v-model:value="articleForm.articleDesc"  placeholder="请输入摘要" />
                    </a-form-item>
                    <a-form-item label="文章分类" name="articleCategory">
                        <a-select v-model:value="articleForm.articleCategory" placeholder="请选择分类">
                            <a-select-option v-for="item in categoryList" :key="item.id" :value="item.name" />
                        </a-select>
                    </a-form-item>
                </a-col>

                <!-- 文章封面 -->
                <a-col :span="12">
                    <a-form-item label="文章封面" name="articleCover">
                        <a-row gutter={16}>
                            <a-col :span="12">
                                <!-- 图片上传 -->
                                <a-upload
                                    :action="uploadUrl"
                                    list-type="picture-card"
                                    :file-list="fileList"
                                    :show-upload-list="false"
                                    :on-change="handleImageChange"
                                >
                                    <a-button icon="upload">点击上传</a-button>
                                </a-upload>
                            </a-col>
                            <a-col :span="12">
                                <!-- 图片链接 -->
                                <a-input
                                    v-model:value="articleForm.articleAvatar"
                                    placeholder="或填写图片链接"
                                    type="url"
                                />
                                <span>预览</span>
                                <div v-if="articleForm.articleAvatar">
                                    <img :src="articleForm.articleAvatar" alt="" style="width: 100px; height: auto;">
                                </div>
                            </a-col>
                        </a-row>
                    </a-form-item>
                </a-col>
            </a-row>

            <!-- 文章内容 -->
            <a-form-item label="文章内容" name="articleContent">
                <JoditEditor :key="jodit" v-model:value="articleForm.articleContent"/>
            </a-form-item>

        </a-form>
        <a-button class="save-button" type="primary" @click="handleSubmit">保存</a-button>
    </div>
</template>

<script lang="ts" setup>
import {computed, onBeforeUnmount, onMounted, ref, toRaw, watch, watchEffect} from "vue";
import { useRouter } from "vue-router";
import JoditEditor from "../plugins/JoditEditor.vue";
import { useArticleStore } from "../store/index";
import {message, Modal} from "ant-design-vue";
import myAxios from "../plugins/myAxios";

const router = useRouter();
const jodit = ref();

// 当前文章数据
const articleForm = ref({
    articleTitle: '',
    articleDesc: '',
    articleAvatar: '',
    articleContent: '',
    articleId: ''
});
const articleStore = useArticleStore();

const isEdit = computed(() => !!articleStore.selectedArticle);

if (articleStore.selectedArticle) {
    articleForm.value = articleStore.selectedArticle;
}

// 文章表单验证规则
const rules = {
    articleTitle: [{ required: true, message: "标题不能为空", trigger: "blur" }],
    articleContent: [{ required: true, message: "内容不能为空", trigger: "blur" }],
};

const uploadUrl = 'http://localhost:8089/upload';  // 修改为实际的上传接口

// 文件上传列表
const fileList = ref([]);

// 处理图片上传
const handleImageChange = (info) => {
    if (info.file.status === 'done') {
        // 上传成功，更新封面图片链接
        articleForm.value.articleAvatar = "http://localhost:8089" + info.file.response.data;
    } else if (info.file.status === 'error') {
    message.error('上传失败');
}
};
watchEffect(() => {
    console.log(articleForm.value.articleAvatar);
});
// 提交表单
const handleSubmit = () => {
    Modal.confirm({
        title: '确认提交保存?',
        okText: '确定',
        cancelText: '取消',
        onOk() {
            try {
                myAxios.post('article/updateArticle', articleForm.value, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then(res => {

                    console.log(res);
                    if (res.data.code === 0) {
                        Modal.success({
                            title: '保存成功',
                            content: res.message,
                        });
                        useArticleStore().setSelectedArticle(null);
                        router.back();
                    } else {
                        Modal.error({
                            title: '保存失败',
                            content: res.message,
                        });
                    }
                });
            } catch (error) {
                console.error('提交表单时出错:', error);
            }
        },
        onCancel() {
            console.log('取消返回');
        }
    });

    return;
};

// 退出编辑
onMounted(() => {
    setTimeout(() => {}, 500);
});

onBeforeUnmount(() => {
    if (jodit.value) {
        jodit.value.editorInstance.destruct();
    }
});

const handleBack = () => {
    Modal.confirm({
        title: '确认返回?',
        content: '返回后您的修改将不会保存，是否继续？',
        okText: '返回',
        cancelText: '取消',
        onOk() {
            router.back();
        },
        onCancel() {
            console.log('取消返回');
        }
    });
};
</script>

<style scoped>
.article-edit {
    margin-bottom: 20px;
    padding: 20px;
    background-color: rgba(239, 233, 233, 0.93);
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.edit-title {
    text-align: center;
    font-size: 26px;
    margin-bottom: 20px;
    color: #333;
}

.back-button {
    margin-left: 20px;
}

.save-button {
    display: block;
    margin: auto 20% 20px auto;
}

a-form-item {
    margin-bottom: 20px;
}

a-input, a-textarea, a-upload {
    border-radius: 6px;
}

a-button {
    border-radius: 6px;
}

a-button[type="default"] {
    background-color: #f0f2f5;
    border-color: #d9d9d9;
}

a-button[type="primary"] {
    background-color: #1890ff;
    border-color: #1890ff;
}

a-button[type="default"]:hover {
    background-color: #e6f7ff;
}

a-button[type="primary"]:hover {
    background-color: #40a9ff;
}
</style>
