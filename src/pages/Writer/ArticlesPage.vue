<template>
    <div class="article-management">
        <h2 class="page-title">文章详情页</h2>
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

    </div>
</template>

<script setup lang="ts">
import {computed, onMounted, ref} from "vue";
import ArticleModal from "../../components/modals/ArticleDetailModal.vue";
import myAxios from "../../plugins/myAxios";
import dayjs from "dayjs";
import { fieldMappings } from "../../utils/mapping.js";
import {message} from "ant-design-vue";
import { useArticleStore, useUserStore } from "../../store";
import { useRouter } from "vue-router";

const mappings = fieldMappings;
const pagination = computed(() => {
    return {
        current: 1,
        pageSize: 10,
        total: dataSource.value.length,
        showTotal: (total) => '共'+total+'条记录',
        showSizeChanger: true,
        onChange: (page: number, pageSize: number) => {
            pagination.value.current = page;
            pagination.value.pageSize = pageSize;
        },
    }
});

const userStore = useUserStore();

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
const getArticles = async () => {
  try {
    const userId = userStore.userInfo.id; // 假设userId在请求期间不会改变，这里提前获取
    const response = await myAxios.get("/article/getArticlesByAuthorId", {
      params: { id: userId }
    });

    if (response.data.code === 0) {
      dataSource.value = response.data.data; // 设置表格数据源
      console.log(dataSource.value);
    } else {
      console.error("获取文章失败", response.data); // 使用console.error以便在日志中更容易区分错误信息
    }
  } catch (error) {
    console.error("请求文章数据时发生错误", error); // 捕获并处理请求过程中可能发生的任何错误
  }
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

const articleStore = useArticleStore();
const router = useRouter();
// 修改文章
const editeArticle = (record: any) => {
    articleStore.selectedArticle = record;
    router.push({
        path: "/articleEditor",
    });
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

<style scoped>
.article-management {
    padding: 20px;
}

.page-title {

}
</style>
