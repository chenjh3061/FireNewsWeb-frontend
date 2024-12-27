<template>
    <div class="news-management">
        <h2 class="title">文章管理</h2>

        <!-- 操作按钮，点击弹出新闻管理的Modal -->
        <a-button type="primary" @click="openAddModal">新增文章</a-button>

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
                        <img :src="record.articleAvarar" alt="" class="avatar"/>
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
                        <a-button id="action" @click="viewDetails(record)">查看/修改</a-button>
                        <a-button @click="deleteNews(record.id)">删除文章</a-button>
                    </template>
                </template>
            </a-table>
        </a-skeleton>
        <!-- 弹窗 - 用于新增新闻 -->
        <a-modal v-model:visible="addModalVisible" :footer="null" title="新增新闻" @cancel="handleCancel">
            <div class="modal-content">
                <a-form :form="form">
                    <a-form-item label="新闻标题">
                        <a-input v-model:value="formData.title"/>
                    </a-form-item>
                    <a-form-item label="新闻内容">
                        <jodit-editor v-model="formData.content" :config="{readonly: false}"/>
                    </a-form-item>
                </a-form>
                <div class="modal-footer">
                    <a-button @click="handleCancel">取消</a-button>
                    <a-button type="primary" @click="handleOk">保存</a-button>
                </div>
            </div>
        </a-modal>

        <!-- 弹窗 - 用于修改新闻 -->
        <ArticleEditModal
                :article="selectedArticle"
                :visible="isModalVisible"
                @cancel="handleCancel"
                @close="isModalVisible = false"
                @save="handleOk"
        />
    </div>
</template>

<script lang="ts" setup>
import {computed, onMounted, ref} from "vue";
import {message, TableColumnsType} from "ant-design-vue";
import myAxios from "../../plugins/myAxios";
import JoditEditor from "../../plugins/JoditEditor.vue";
import dayjs from "dayjs";
import ArticleEditModal from "../../components/modals/ArticleEditModal.vue";
import {fieldMappings} from "../../utils/mapping.js";

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
    {title: "文章简介", dataIndex: "articleDesc", key: "content", resizable: true, minWidth: 100},
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
            getArticles(); // 分页更新时重新请求数据
        },
        onShowSizeChange: (current: number, size: number) => {
            currentPage.value = current;  // 更新当前页
            pageSize.value = size;         // 更新每页条数
            getArticles();  // 当改变每页条数时重新请求数据
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
const addModalVisible = ref(false);
const isModalVisible = ref(false);
const selectedArticle = ref(null);
const formData = ref({
    id: undefined,
    title: "",
    content: "",
});
const form = ref(null);

// 打开 Modal 用于新增新闻
const openAddModal = () => {
    formData.value = {id: undefined, title: "", content: ""};
    addModalVisible.value = true;
};

// 浏览详情
const viewDetails = (record: any) => {
    selectedArticle.value = record;
    isModalVisible.value = true;
};

const isEdit = ref(false);
const editorKey = ref(0); // 用于强制刷新组件

// 开始编辑
const startEdit = () => {
    isEdit.value = !isEdit.value;
    editorKey.value++;
};

// 取消 Modal
const handleCancel = () => {
    isModalVisible.value = false;
    addModalVisible.value = false;
};

// 保存或更新新闻
const handleOk = () => {
    formData.value = selectedArticle.value;
    console.table(formData.value);
    if (!formData.value.articleTitle || !formData.value.articleContent) {
        message.error("标题和内容不能为空");
        return;
    }

    if (formData.value.id) {
        // 更新新闻
        const index = newsData.value.findIndex(news => news.id === formData.value.id);
        if (index !== -1) {
            newsData.value[index] = {id: 1, ...formData.value};
        }
        message.success("新闻更新成功");
    } else {
        // 新增新闻
        const newId = newsData.value.length + 1;
        newsData.value.push({id: newId, ...formData.value});
        message.success("新闻新增成功");
    }

    isModalVisible.value = false;
    addModalVisible.value = false;
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
