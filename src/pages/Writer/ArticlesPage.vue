<template>
    <div class="article-management">
        <h2>文章详情页</h2>
        <a-table
            :columns="columns"
            :data-source="dataSource"
            bordered
            :pagination="{ pageSize: 10 }"
        >
            <template #bodyCell="{ column, record }">
                <template v-if="column.dataIndex === 'action'">
                    <a-button id="action" @click="viewDetails(record)">查看详情</a-button>
                    <a-button id="action" @click="editeArticle(record)">修改文章</a-button>
                </template>
            </template>
        </a-table>

        <!-- 引入的文章详情弹窗 -->
        <ArticleModal
            v-model:visible="isModalVisible"
            :article="selectedArticle"
        />
    </div>
</template>

<script setup lang="ts">
import {onMounted, ref} from "vue";
import ArticleModal from "../../components/modals/ArticleModal.vue";
import myAxios from "../../plugins/myAxios"; // 引入弹窗组件

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
const isModalVisible = ref(false);
const selectedArticle = ref(null);

// 查看详情
const viewDetails = (record: any) => {
    selectedArticle.value = record; // 设置当前文章
    isModalVisible.value = true; // 打开弹窗
};

// 修改文章
const editeArticle = (record: any) => {
    console.log(record);
};

onMounted(() => {
    getArticles(); // 获取文章数据
})
</script>
