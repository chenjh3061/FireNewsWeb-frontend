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
            <a-button type="primary" @click="handleReset">重置</a-button>
        </div>

        <!-- 评论列表表格 -->
        <a-table
            :columns="columns"
            :data-source="allComments"
            :pagination="pagination"
            :rowKey="record => record.id"
            sticky
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
                        <div>{{ record.userName }}</div>
                    </div>
                </template>
                <template v-if="column.dataIndex === 'status'">
                    <a-switch
                        :checked="record.isShow === 1"
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
// 评论列表
const allComments = ref<any[]>([]);
// 当前页码
const currentPage = ref(1);
// 每页条数
const pageSize = ref(20);
// 原始评论列表，用于搜索后恢复数据
const originalComments = ref<any[]>([]);

// 从后端获取评论
const getComments = async () => {
    try {
        const res = await myAxios.get("/comments/getAllCommentsByPage", {
            params: { page: currentPage.value - 1, size: pageSize.value },
        });
        allComments.value = res.data.data;
        originalComments.value = res.data.data;
    } catch (error) {
        message.error("获取评论失败！" + (error as Error).message);
    }
};

onMounted(() => {
    getComments();
});

// 表格列配置
const columns = ref([
    {
        title: "评论内容",
        dataIndex: "content",
        key: "content",
        width: 300,
        sorter: (a: any, b: any) => a.content.length - b.content.length,
        sortDirections: ["ascend", "descend"],
    },
    {
        title: "文章",
        dataIndex: "article",
        key: "article",
        width: 200,
        sorter: (a: any, b: any) => a.articleTitle.localeCompare(b.articleTitle),
        sortDirections: ["ascend", "descend"],
    },
    {
        title: "用户",
        dataIndex: "user",
        key: "user",
        width: 200,
        sorter: (a: any, b: any) => a.userName.localeCompare(b.userName),
        sortDirections: ["ascend", "descend"],
    },
    {
        title: "状态",
        dataIndex: "status",
        key: "status",
        width: 100,
        align: "center",
        sorter: (a: any, b: any) => (a.status === "approved" ? -1 : 1),
        sortDirections: ["ascend", "descend"],
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
const pagination = computed(() => {
    return {
        current: currentPage.value,
        pageSize: pageSize.value,
        total: allComments.value.length,
        showTotal: (total) => `共${total}条记录`,
        showSizeChanger: true,
        pageSizeOptions: ["10", "20", "30", "50"],
        onChange: (page: number, size: number) => {
            currentPage.value = page;
            pageSize.value = size;
            getComments();
        },
        onShowSizeChange: (current: number, size: number) => {
            currentPage.value = current;
            pageSize.value = size;
            getComments();
        },
    };
});

// 切换评论状态
const toggleStatus = async (record: any) => {
    try {
        const res = await myAxios.post("/comments/changeCommentStatus", {
            id: record.id,
            status: record.isShow === 1 ? 0 : 1,
        });
        if (res.data.code !== 0) {
            message.error("更新评论状态失败！");
        } else {
            message.success("评论状态已更新！");
            record.isShow = res.data.data;
        }
    } catch (error) {
        message.error("更新评论状态失败！" + (error as Error).message);
    }
};

// 删除评论
const deleteComment = (record: any) => {
    Modal.confirm({
        title: "确认删除",
        content: `确定要删除这条评论吗？`,
        async onOk() {
            try {
                const res = await myAxios.delete("/comments/deleteCommentById", {
                    params: { id: record.id },
                });
                if (res.data.code === 0) {
                    allComments.value = allComments.value.filter(
                        (comment) => comment.id !== record.id
                    );
                    originalComments.value = originalComments.value.filter(
                        (comment) => comment.id !== record.id
                    );
                    pagination.value.total = allComments.value.length;
                    message.success("评论已删除！");
                }
            } catch (error) {
                message.error("删除评论失败！" + (error as Error).message);
            }
        },
    });
};

// 搜索评论
const handleSearch = async () => {
    if (!searchQuery.value) {
        message.info("请输入搜索内容！");
        return;
    }
    try {
        const res = await myAxios.get("/comments/searchCommentsByPage", {
            params: { keyword: searchQuery.value },
        });
        if (res.data.code === 0) {
            allComments.value = res.data.data;
            pagination.value.current = 1;
            pagination.value.total = allComments.value.length;
        } else {
            message.error("搜索失败！");
        }
    } catch (error) {
        message.error("搜索失败！" + (error as Error).message);
    }
};

const handleReset = () => {
    searchQuery.value = "";
    getComments();
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
    display: flex;
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