<template>
    <div class="audit-page">
        <h2 class="page-title">文章审核</h2>

        <!-- 文章列表展示 -->
        <a-table :columns="columns" :data-source="articles" row-key="articleId"
                 :pagination="pagination" @resizeColumn="handleResizeColumn">
            <template #bodyCell="{ column, record }">
                <template v-if="column.dataIndex === 'createTime'">
                    {{ dayjs(record.createTime).format("YYYY-MM-DD HH:mm") }}
                </template>
                <template v-if="mappings[column.dataIndex]">
                    <a-tag v-bind="mappings[column.dataIndex](record)">
                        {{ mappings[column.dataIndex](record).text }}
                    </a-tag>
                </template>
                <template v-if="column.dataIndex === 'action'" id="action-button">
                    <!-- 查看详情按钮 -->
                    <a-button type="default" @click="viewArticle(record)">查看详情</a-button>

                    <!-- 审核通过和拒绝按钮 -->
                    <a-button type="primary" @click="approveArticle(record)">通过</a-button>
                    <a-button type="primary" danger @click="rejectArticle(record)">拒绝</a-button>
                </template>
            </template>
        </a-table>

        <!-- 弹窗显示文章详情 -->
        <ArticleModal
            v-model:visible="isModalVisible"
            :article="selectedArticle"
        />

        <!-- 批注输入弹窗 -->
        <a-modal
            v-model:visible="isCommentModalVisible"
            title="填写批注"
            @cancel="closeCommentModal"
            @ok="submitComment"
        >
            <a-textarea v-model:value="comment" placeholder="请输入批注..." rows="4"></a-textarea>
        </a-modal>
    </div>
</template>


<script lang="ts" setup>
import { computed, ref } from "vue";
import { message, TableColumnsType } from "ant-design-vue";
import myAxios from "../../plugins/myAxios";
import { fieldMappings } from "../../utils/mapping.js";
import dayjs from "dayjs";
import ArticleModal from "../../components/modals/ArticleDetailModal.vue";
const mappings = fieldMappings;

// 模拟文章数据
const articles = ref([
    {
        articleId: 1,
        articleTitle: "文章 1",
        articleDesc: "这是一篇待审核的文章",
        articleContent: "文章内容一",
        articleAvatar: "/uploads/sample1.jpg",
        status: "待审核"
    },
    {
        articleId: 2,
        articleTitle: "文章 2",
        articleDesc: "这是一篇待审核的文章",
        articleContent: "文章内容二",
        articleAvatar: "/uploads/sample2.jpg",
        status: "待审核"
    }
]);

// 表格列配置
const columns = ref<TableColumnsType>([
    { title: "文章标题", dataIndex: "articleTitle", key: "articleTitle", resizable: true, minWidth: 200 },
    { title: "文章摘要", dataIndex: "articleDesc", key: "articleDesc", resizable: true, minWidth: 200 },
    { title: "文章作者", dataIndex: "authorName", key: "authorName", resizable: true, minWidth: 200 },
    { title: "作者id", dataIndex: "authorId", key: "authorId", resizable: true, minWidth: 200 },
    { title: "发布时间", dataIndex: "createTime", key: "createTime", resizable: true, minWidth: 200 },
    { title: "审核状态", dataIndex: "reviewStatus", key: "reviewStatus", resizable: true, minWidth: 200 },
    {
        title: "操作",
        dataIndex: "action",
        key: "action",
    }
]);

function handleResizeColumn(w, column) {
    column.width = w;
}

const pagination = computed(() => {
    return {
        current: 1,
        pageSize: 10,
        total: articles.value.length,
        showTotal: (total) => "共 " + total + " 条数据",
        showSizeChanger: true,
        onChange: (page: number, pageSize: number) => {
            pagination.value.current = page;
            pagination.value.pageSize = pageSize;
        },
    }
});

// 模态框显示状态
const isModalVisible = ref(false);
const selectedArticle = ref(null);

// 批注输入弹窗相关状态
const isCommentModalVisible = ref(false);
const comment = ref(""); // 用来存储批注的内容
const currentArticle = ref(null); // 用来存储当前操作的文章

const getArticles = () => {
    try {
        myAxios.get("/article/getUnreviewedArticles").then(res => {
            if (res.data.code === 0) {
                articles.value = res.data.data;
            } else {
                message.error(res.data.message);
            }
        });
    } catch (e) {
        message.error("获取文章列表失败");
    }
}

getArticles();

// 查看文章详情
const viewArticle = (article) => {
    selectedArticle.value = article;
    isModalVisible.value = true;
};

// 关闭文章详情模态框
const closeModal = () => {
    isModalVisible.value = false;
};

const reviewStatus = ref(null);

// 打开批注模态框
const approveArticle = (article) => {
    currentArticle.value = article;
    reviewStatus.value = 1;
    isCommentModalVisible.value = true;
};

// 拒绝审核并填写批注
const rejectArticle = (article) => {
    currentArticle.value = article;
    reviewStatus.value = 2;
    isCommentModalVisible.value = true;
};

// 关闭批注输入弹窗
const closeCommentModal = () => {
    isCommentModalVisible.value = false;
    reviewStatus.value = null;
    comment.value = ""; // 清空批注内容
    currentArticle.value = null;
};

// 提交批注
const submitComment = () => {
    if (!comment.value.trim()) {
        message.error("批注不能为空");
        return;
    }

    // 发送请求将批注和审核结果一并提交
    myAxios.post("/article/reviewArticle", {
        id: currentArticle.value.articleId,
        reviewMessage: comment.value,
        reviewStatus: reviewStatus.value,
    },{headers:{
        'Content-Type': 'application/json',

    }}).then(res => {
        if (res.data.code === 0) {
            message.success("提交成功");
        } else {
            message.error(res.data.message);
        }
    }).catch(err => {
        message.error(err+"提交批注失败");
    });

    // 更新文章状态
    if (currentArticle.value.status !== 0) {
        currentArticle.value.status = 1;
        message.success(`文章《${currentArticle.value.articleTitle}》已通过审核，批注：${comment.value}`);
    } else {
        currentArticle.value.status = 2;
        message.error(`文章《${currentArticle.value.articleTitle}》审核被拒绝，批注：${comment.value}`);
    }
    // 更新文章列表
    getArticles();
    // 关闭弹窗
    closeCommentModal();
};
</script>


<style scoped>
.audit-page {
    padding: 20px;
    background-color: #f9f9f9;
}

.page-title {
    text-align: center;
    margin-bottom: 20px;
}

.a-table {
    margin-top: 20px;
}

.a-button {
    margin: 0 5px;
}
#action-button {
    display: flex;
    justify-content: space-between;
}
</style>
