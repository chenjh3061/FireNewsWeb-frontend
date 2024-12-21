<template>
    <div class="news-management">
        <h2 class="title">新闻管理</h2>

        <!-- 操作按钮，点击弹出新闻管理的Modal -->
        <a-button type="primary" @click="openAddModal">新增新闻</a-button>

        <!-- 新闻列表 -->
        <a-table
            :columns="columns"
            :dataSource="newsData"
            :rowKey="record => record.id"
            class="news-table"
            @resizeColumn="handleResizeColumn"
        >
            <template #bodyCell="{column, record}">
                <template v-if="column.dataIndex === 'reviewStatus'">
                    <a-tag class="tag"
                        :color="record.reviewStatus === 0 ? 'blue' : record.reviewStatus === 1 ? 'green' : 'red'"
                    >
                        {{ record.reviewStatus === 0 ? '未审核' : record.reviewStatus === 1 ? '审核通过' : '拒绝' }}
                    </a-tag>
                </template>
                <template v-if="column.dataIndex === 'action'">
                    <a-button id="action" @click="viewDetails(record)">查看/修改</a-button>
                    <a-button>删除文章</a-button>
                </template>
            </template>
        </a-table>

        <!-- 弹窗 - 用于新增新闻 -->
        <a-modal v-model:visible="addModalVisible" :footer="null" title="新增新闻" @cancel="handleCancel">

        </a-modal>
        <!-- 弹窗 - 用于修改新闻 -->
        <a-modal
            v-model:visible="isModalVisible"
            :footer="null"
            width="850px"
            title="新闻编辑"
            @cancel="handleCancel"
            @ok="handleOk"
        >
            <div class="modal-content">
                <a-form :form="form">
                    <a-form-item label="新闻标题">
                        <a-input v-model:value="selectedArticle.articleTitle"/>
                    </a-form-item>
                    <a-button @click="startEdit">切换只读</a-button>
                    <a-form-item label="新闻内容">
                        <jodit-editor v-model:value="selectedArticle.articleContent" :config="{readonly: isEdit}"/>
                    </a-form-item>
                </a-form>
                <div class="modal-footer">
                    <a-button @click="handleCancel">取消</a-button>
                    <a-button type="primary" @click="handleOk">保存</a-button>
                </div>
            </div>
        </a-modal>
    </div>
</template>

<script lang="ts" setup>
import {onMounted, ref, watch} from "vue";
import {message, TableColumnsType} from "ant-design-vue";
import myAxios from "../../plugins/myAxios";
import JoditEditor from "../../plugins/JoditEditor.vue";

// 新闻数据
const newsData = ref([
    {id: 1, title: "新闻标题 1", content: "新闻内容 1"},
    {id: 2, title: "新闻标题 2", content: "新闻内容 2"},
]);

// 表格列配置
const columns = ref<TableColumnsType>([
    { title: "新闻标题", dataIndex: "articleTitle", key: "title", resizable: true, minWidth: 100 },
    { title: "新闻介绍", dataIndex: "articleDesc", key: "content", resizable: true, minWidth: 100},
    { title: "作者", dataIndex: "authorName", key: "author", resizable: true, minWidth: 100 },
    { title: "提交时间", dataIndex: "createTime", key: "time", resizable: true, minWidth: 100 },
    { title: "审核状态", dataIndex: "reviewStatus", key: "status", resizable: true, minWidth: 100 },
    {
        title: "操作",
        dataIndex: "action",
        key: "action",
        resizable: true, minWidth: 100,
    },
]);

// 表格列宽拖动
function handleResizeColumn(w, column){
    column.width = w;
};

// 请求文章数据
const getArticles = () => {
    // 请求数据
    myAxios.get("/article/getAllArticles").then((res) => {

        if (res.data.code === 0) {
            newsData.value = res.data.data; // 设置表格数据源
            console.table(res.data.data);
        } else {
            console.log("获取文章失败");
        }
    });
};

// Modal 控制
const addModalVisible = ref(false);
const isModalVisible = ref(false);
const selectedArticle = ref(null);
const formData = ref({
    id: 0,
    title: "",
    content: "",
});
const form = ref(null);

// 打开 Modal 用于新增或编辑
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
};

// 保存或更新新闻
const handleOk = () => {
    if (!formData.value.title || !formData.value.content) {
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
};

// 编辑新闻
const editNews = (record: any) => {
    formData.value = {...record};
    isModalVisible.value = true;
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
}

.modal-footer {
    display: flex;
    justify-content: flex-end;
    margin-top: 20px;
}

.modal-footer a-button {
    margin-left: 10px;
}
</style>
