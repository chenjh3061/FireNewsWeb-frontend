<template>
    <div class="news-management">
        <h2 class="title">文章管理</h2>

        <!-- 操作按钮，点击弹出新闻管理的Modal -->
        <a-button type="primary" @click="addArticle">新增文章</a-button>

        <!-- 新闻列表 -->
        <a-skeleton :loading="loading" active :style="{margin: '20px',}">
            <a-table
                    :columns="columns"
                    :dataSource="newsData"
                    :loading="loading"
                    :pagination="pagination"
                    :rowKey="record => record.id"
                    class="news-table"
                    @resizeColumn="handleResizeColumn"
            >
                <template #bodyCell="{ column, record }">
                    <template v-if="column.dataIndex === 'articleAvatar'">
                        <img :src="record.articleAvatar" alt="文章封面" class="article-avatar"/>
                    </template>
                    <template v-if="column.dataIndex === 'articleCategory'">
                        {{ mappings[column.dataIndex](record).text }}
                    </template>
                    <template v-if="column.dataIndex === 'createTime'">
                        {{ dayjs(record.createTime).format("YYYY-MM-DD HH:mm") }}
                    </template>
                    <template v-if="column.dataIndex === 'reviewStatus'">
                        <a-tag v-bind="mappings[column.dataIndex](record)">
                            {{ mappings[column.dataIndex](record).text }}
                        </a-tag>
                    </template>
                    <template v-if="column.dataIndex === 'action'">
                        <a-button id="action" @click="viewDetails(record)">查看详情</a-button>
                        <a-button id="action" @click="editeArticle(record)">修改文章</a-button>
                        <a-button @click="deleteNews(record.id)">删除文章</a-button>
                    </template>
                </template>
            </a-table>
        </a-skeleton>

        <!-- 弹窗 - 用于修改新闻 -->
        <ArticleModal
            v-model:visible="isModalVisible"
            :article="selectedArticle"
        />
    </div>
</template>

<script lang="ts" setup>
import {computed, onMounted, ref} from "vue";
import {message, TableColumnsType} from "ant-design-vue";
import myAxios from "../../plugins/myAxios";
import JoditEditor from "../../plugins/JoditEditor.vue";
import dayjs from "dayjs";
import ArticleModal from "../../components/modals/ArticleDetailModal.vue";
import {fieldMappings} from "../../utils/mapping.js";
import {useArticleStore} from "../../store";
import {useRouter} from "vue-router";

const mappings = fieldMappings;

// 新闻数据
const newsData = ref([
    {id: 1, title: "新闻标题 1", content: "新闻内容 1"},
    {id: 2, title: "新闻标题 2", content: "新闻内容 2"},
]);

// loading 状态
const loading = ref(false);

// 表格列配置
const columns = ref<TableColumnsType>([
    {title: "文章标题", dataIndex: "articleTitle", key: "title", resizable: true, minWidth: 100},
    {title: "文章封面", dataIndex: "articleAvatar", key: "avatar", resizable: true, minWidth: 100},
    {title: "文章类型", dataIndex: "articleCategory", key: "Category", resizable: true, minWidth: 100},
    {title: "作者", dataIndex: "authorName", key: "author", resizable: true, minWidth: 100},
    {title: "提交时间", dataIndex: "createTime", key: "time", resizable: true, minWidth: 100},
    {title: "审核状态", dataIndex: "reviewStatus", key: "status", resizable: true, minWidth: 100},
    {title: "操作", dataIndex: "action", key: "action", resizable: true, minWidth: 100},
]);

// 表格列宽拖动
function handleResizeColumn(w, column) {
    column.width = w;
}

const currentPage = ref(1);
const pageSize = ref(10);
const pagination = computed(() => {
    return {
        current: currentPage.value,
        pageSize: pageSize.value,
        total: newsData.value.length,  // 根据总数据的长度设置
        showTotal: (total) => `共 ${total} 条数据`,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '30', '50'],
        onChange: (page: number, size: number) => {
            currentPage.value = page;  // 更新当前页
            pageSize.value = size;      // 更新每页条数
        },
        onShowSizeChange: (current: number, size: number) => {
            currentPage.value = current;  // 更新当前页
            pageSize.value = size;         // 更新每页条数
        },
    };
});
// 请求文章数据
const getArticles = () => {
    loading.value = true; // 开始加载
    myAxios.get("/article/getAllArticles").then((res) => {
        loading.value = false; // 加载完成
        if (res.data.code === 0) {
            newsData.value = res.data.data; // 设置表格数据源
            console.table(res.data.data);
        } else {
            console.log("获取文章失败");
        }
    }).catch(() => {
        loading.value = false; // 加载完成，即使发生错误
        message.error("加载文章数据失败");
    });
};

// Modal 控制
const isModalVisible = ref(false);
const selectedArticle = ref(null);

// 添加新闻
const addArticle = () => {
    articleStore.selectedArticle = null;
    router.push({
        path: "/articleEditor",
    });
};

// 浏览详情
const viewDetails = (record: any) => {
    selectedArticle.value = record;
    isModalVisible.value = true;
};

const articleStore = useArticleStore();
const router = useRouter();
// 修改文章
const editeArticle = (record: any) => {
    articleStore.selectedArticle = record;
    router.push({
        path: "/articleEditor",
    });
};

// 删除新闻
const deleteNews = (id: number) => {
    newsData.value = newsData.value.filter(news => news.id !== id);
    message.success("新闻删除成功");
};

onMounted(() => {
    getArticles();
});
</script>

<style scoped>
.news-management {
    padding: 20px;
}

.title {
    font-size: 24px;
    margin-bottom: 20px;
}

.news-table {
    margin-top: 20px;
}

.tag {
    font-size: 18px;
}

.article-avatar {
    width: 250px;
    height: 150px;
    img {
        width: 100px;
        height: 100px;
        object-fit: cover;
    }
}

.modal-content {
    display: block;
    margin: 0 auto;
    width: 800px;
    padding: 20px;
    box-sizing: border-box;
}

.modal-footer {
    display: flex;
    justify-content: flex-end;
    margin-top: 20px;
}

.modal-footer a-button {
    margin-left: 10px;
}

.modal-content a-form-item {
    margin-bottom: 16px;
}
</style>
