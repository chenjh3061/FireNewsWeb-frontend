<template>
    <div class="article-management">
        <h2>文章详情页</h2>
        <a-table
            :columns="columns"
            :data-source="dataSource"
            bordered
            :pagination="pagination"
        >
            <template #bodyCell="{ column, record }">
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
                </template>
            </template>
        </a-table>

        <!-- 引入的文章详情弹窗 -->
        <ArticleModal
            v-model:visible="isDetailVisible"
            :article="selectedArticle"
        />

        <!-- 引入的文章编辑弹窗 -->
        <ArticleEditModal
            :visible="isEditVisible"
            @close="isEditVisible = false"
            :article="selectedArticle"
            @save="handleOk"
            @cancel="handleCancel"
        />

    </div>
</template>

<script setup lang="ts">
import {computed, onMounted, ref} from "vue";
import ArticleModal from "../../components/modals/ArticleDetailModal.vue";
import myAxios from "../../plugins/myAxios";
import dayjs from "dayjs"; // 引入弹窗组件
import { fieldMappings } from "../../utils/mapping.js";
import {message} from "ant-design-vue";
import ArticleEditModal from "../../components/modals/ArticleEditModal.vue";

const mappings = fieldMappings;
const pagination = computed(() => {
    return {
        current: 1,
        pageSize: 10,
        total: dataSource.value.length,
        showTotal: (total) => total,
        showSizeChanger: true,
        onChange: (page: number, pageSize: number) => {
            pagination.value.current = page;
            pagination.value.pageSize = pageSize;
            getArticles(); // 分页更新时重新请求数据
        },
    }
});

// 示例文章数据
const dataSource = ref([
    {
        id: 1,
        title: "火灾案例分析",
        submitDate: "2024-12-01",
        status: "已发布",
        content: "<p>这是案例分析</p>",
    },
]);

// 表格列定义
const columns = ref([
    { title: "文章标题", dataIndex: "articleTitle", key: "title" },
    { title: "提交时间", dataIndex: "createTime", key: "submitDate" },
    { title: "状态", dataIndex: "reviewStatus", key: "status" },
    {
        title: "操作",
        key: "action",
        dataIndex: "action",
    },
]);

// 请求文章数据
const getArticles = () => {
    // 请求数据
    myAxios.get("/article/getAllArticles").then((res) => {

        if (res.data.code === 0) {
            dataSource.value = res.data.data; // 设置表格数据源
            console.log(dataSource.value);
        } else {
            console.log("获取文章失败");
        }
    });
};

// 弹窗状态及选中的文章
const isDetailVisible = ref(false);
const isEditVisible = ref(false);
const selectedArticle = ref(null);
const formData = ref();
const isEdit = ref(false);
const ArticleForm = ref();
// 查看详情
const viewDetails = (record: any) => {
    selectedArticle.value = record; // 设置当前文章
    isDetailVisible.value = true; // 打开弹窗
};

// 修改文章
const editeArticle = (record: any) => {
    selectedArticle.value = record; // 设置当前文章
    isEditVisible.value = true; // 打开弹窗

};
// 取消 Modal
const handleCancel = () => {
    isEditVisible.value = false;
};
const startEdit = () => {
    isEdit.value = !isEdit.value;
};

// 保存或更新新闻
const handleOk = () => {
    formData.value = selectedArticle.value;
    console.log(formData.value);
    if (!formData.value.articleTitle || !formData.value.articleContent) {
        message.error("标题和内容不能为空");
        return;
    }

    if (formData.value.id) {
        // 更新新闻
        const index = dataSource.value.findIndex(news => news.id === formData.value.id);
        if (index !== -1) {
            dataSource.value[index] = { id: 1, ...formData.value };
        }
        message.success("新闻更新成功");
    } else {
        // 新增新闻
        const newId = dataSource.value.length + 1;
        dataSource.value.push({ id: newId, ...formData.value });
        message.success("新闻新增成功");
    }

    isEditVisible.value = false;
};
onMounted(() => {
    getArticles(); // 获取文章数据
})
</script>
