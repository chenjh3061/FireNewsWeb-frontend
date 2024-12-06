<template>
    <div class="work-management">
        <h2>作品管理</h2>
        <a-table
                :columns="columns"
                :data-source="dataSource"
                row-key="id"
                bordered
                pagination="{ pageSize: 5 }"
        >
            <template #actions="{ record }">
                <a-space>
                    <a-button type="link" @click="viewDetails(record)">查看详情</a-button>
                    <a-button type="link" @click="editWork(record)">修改</a-button>
                    <a-popconfirm
                            title="确定删除该作品吗？"
                            ok-text="是"
                            cancel-text="否"
                            @confirm="deleteWork(record)"
                    >
                        <a-button type="link" danger>删除</a-button>
                    </a-popconfirm>
                </a-space>
            </template>
        </a-table>
    </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { message } from "ant-design-vue";

// 示例数据
const dataSource = ref([
    {
        id: 1,
        title: "火灾案例分析",
        submitDate: "2024-12-01",
        status: "已发布",
    },
    {
        id: 2,
        title: "森林火灾应急预案",
        submitDate: "2024-11-20",
        status: "审核中",
    },
    {
        id: 3,
        title: "社区火灾安全教育",
        submitDate: "2024-11-15",
        status: "已驳回",
    },
]);

// 表格列定义
const columns = [
    {
        title: "作品标题",
        dataIndex: "title",
        key: "title",
    },
    {
        title: "提交时间",
        dataIndex: "submitDate",
        key: "submitDate",
    },
    {
        title: "状态",
        dataIndex: "status",
        key: "status",
    },
    {
        title: "操作",
        key: "actions",
        scopedSlots: { customRender: "actions" },
    },
];

// 操作函数
const viewDetails = (record: any) => {
    message.info(`查看作品详情：${record.title}`);
};

const editWork = (record: any) => {
    message.success(`修改作品：${record.title}`);
};

const deleteWork = (record: any) => {
    dataSource.value = dataSource.value.filter((work) => work.id !== record.id);
    message.success(`已删除作品：${record.title}`);
};
</script>

<style scoped>
.work-management {
    padding: 16px;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.work-management h2 {
    margin-bottom: 16px;
    font-size: 18px;
    font-weight: bold;
}

.ant-table {
    margin-top: 16px;
}
</style>
