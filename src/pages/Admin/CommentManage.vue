<template>
    <div class="comment-manage">
        <h2>评论管理</h2>

        <!-- 搜索框 -->
        <div class="search-bar">
            <a-input-search
                v-model:value="searchQuery"
                placeholder="请输入用户名称或文章标题"
                enter-button="搜索"
                @search="handleSearch"
            />
        </div>

        <!-- 评论列表表格 -->
        <a-table
            :columns="columns"
            :data-source="allComments"
            :pagination="pagination"
            :rowKey="record => record.id"
        >
            <template #bodyCell="{ column, record }">
                <template v-if="column.dataIndex === 'content'">
                    <div class="comment-content">
                        <span>{{ record.content }}</span>
                    </div>
                </template>
                <template v-if="column.dataIndex === 'article'">
                    <span>{{ record.articleTitle }}</span>
                </template>
                <template v-if="column.dataIndex === 'user'">
                    <div class="user-info">
                        <a-avatar :src="record.userAvatar" style="margin-right: 8px" />
                        <span>{{ record.username }}</span>
                    </div>
                </template>
                <template v-if="column.dataIndex === 'status'">
                    <a-switch
                        :checked="record.status === 'approved'"
                        @change="toggleStatus(record)"
                    />
                </template>
                <template v-if="column.dataIndex === 'action'">
                    <a-button danger @click="deleteComment(record)">删除</a-button>
                </template>
            </template>
        </a-table>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { message, Modal } from "ant-design-vue";
import myAxios from "../../plugins/myAxios";

// 搜索关键字
const searchQuery = ref("");

// 假数据（评论列表）
const allComments = ref([
    {
        id: 1,
        content: "这篇文章写得真棒！",
        articleTitle: "如何优化 Vue 性能",
        userAvatar: "https://via.placeholder.com/40",
        userName: "张三",
        status: "approved",
    },
    {
        id: 2,
        content: "我有不同的看法",
        articleTitle: "如何优化 Vue 性能",
        userAvatar: "https://via.placeholder.com/40",
        userName: "李四",
        status: "pending",
    },
    {
        id: 3,
        content: "受教了！",
        articleTitle: "Vue 3 新特性详解",
        userAvatar: "https://via.placeholder.com/40",
        userName: "王五",
        status: "approved",
    },
    {
        id: 4,
        content: "写得很好，值得收藏",
        articleTitle: "使用 Vuex 管理状态",
        userAvatar: "https://via.placeholder.com/40",
        userName: "赵六",
        status: "approved",
    },
    {
        id: 5,
        content: "讲解清晰易懂",
        articleTitle: "Vue Router 实战教程",
        userAvatar: "https://via.placeholder.com/40",
        userName: "孙七",
        status: "pending",
    },
]);

// 从后端获取评论
const getComments = () => {
    try {
        myAxios.get("/comments/getAllComments").then((res) => {
            allComments.value = res.data.data;
        });
    } catch (error) {
        message.error("获取评论失败！");
    }
}
getComments();
// 表格列配置
const columns = ref([
    { title: "评论内容", dataIndex: "content", key: "content", width: 300 },
    { title: "文章", dataIndex: "article", key: "article", width: 200 },
    { title: "用户", dataIndex: "user", key: "user", width: 200 },
    {
        title: "状态",
        dataIndex: "status",
        key: "status",
        width: 100,
        align: "center",
    },
    {
        title: "操作",
        dataIndex: "action",
        key: "action",
        width: 100,
        align: "center",
    },
]);

// 分页配置
const currentPage = ref(1);
const pageSize = ref(10);
const pagination = computed(() => {
    return {
        current: currentPage.value,
        pageSize: pageSize.value,
        total: allComments.value.length,
        showTotal: (total) => '共'+total+'条记录',
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '30', '50'],
        onChange: (page: number, pageSize: number) => {
            pagination.value.current = page;
            pagination.value.pageSize = pageSize;
        },
        onShowSizeChange: (current: number, size: number) => {
            currentPage.value = current;  // 更新当前页
            pageSize.value = size;         // 更新每页条数
        },
    }
});

// 切换评论状态
const toggleStatus = (record: any) => {
    record.status = record.status === "approved" ? "pending" : "approved";
    message.success("评论状态已更新！");
};

// 删除评论
const deleteComment = (record: any) => {
    Modal.confirm({
        title: "确认删除",
        content: `确定要删除这条评论吗？`,
        onOk() {
            allComments.value = allComments.value.filter(
                (comment) => comment.id !== record.id
            );
            pagination.value.total = allComments.value.length;
            message.success("评论已删除！");
        },
    });
};

const searchList = ref([]);
// 搜索评论
const handleSearch = () => {
    if (!searchQuery.value) return;
    console.log(searchQuery.value);
    searchList.value = allComments.value;
    allComments.value = allComments.value.filter((item) =>
        item.articleTitle.includes(searchQuery.value)
    );
    pagination.value.current = 1; // 搜索后重置到第一页
};
</script>

<style scoped>
.comment-manage {
    padding: 20px;
}

h2 {
    margin-bottom: 20px;
}

.search-bar {
    margin-bottom: 20px;
}

.comment-content {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 280px;
}

.user-info {
    display: flex;
    align-items: center;
}
</style>
