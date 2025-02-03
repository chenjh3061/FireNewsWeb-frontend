<template>
    <div class="notification-management">
        <h2 class="title">通知管理</h2>

        <!-- 操作按钮，点击弹出新增通知的Modal -->
        <a-button type="primary" @click="openModal">新增通知</a-button>

        <!-- 通知列表 -->
        <a-table
            :loading="loading"
            :columns="columns"
            :dataSource="notificationData"
            :rowKey="record => record.id"
            class="notification-table"
            :pagination="pagination"
            @resizeColumn="handleResizeColumn"
        >
            <template #bodyCell="{ column, record }">
                <template v-if="column.dataIndex === 'startTime'">
                    {{ dayjs(record.startTime).format('YYYY-MM-DD HH:mm') }}
                </template>
                <template v-if="column.dataIndex === 'endTime'">
                    {{ dayjs(record.endTime).format('YYYY-MM-DD HH:mm') }}
                </template>
                <template v-if="column.dataIndex === 'action'">
                    <a-button type="primary" @click="editNotification(record)">编辑</a-button>
                    <a-button type="primary" danger @click="deleteNotification(record)">删除</a-button>
                </template>
            </template>
        </a-table>

        <!-- 弹窗 - 用于新增或修改通知 -->
        <a-modal
            v-model:visible="isModalVisible"
            title="通知编辑"
            @cancel="handleCancel"
            @ok="handleOk"
            :footer="null"
        >
            <div class="modal-content">
                <a-form :form="form">
                    <a-form-item label="通知标题">
                        <a-input v-model:value="formData.title" />
                    </a-form-item>
                    <a-form-item label="通知内容">
                        <a-textarea v-model:value="formData.content" rows="4" />
                    </a-form-item>
                    <a-form-item label="通知类型">
                        <a-select v-model:value="formData.type">
                            <a-select-option value="info">信息</a-select-option>
                            <a-select-option value="warning">警告</a-select-option>
                            <a-select-option value="error">错误</a-select-option>
                        </a-select>
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

<script setup lang="ts">
import {onMounted, ref} from "vue";
import {Modal, Button, Table, Input, Form, message, Select, SelectOption, TableColumnsType,} from "ant-design-vue";
import { computed } from "vue";
import myAxios from "@/plugins/myAxios";
import dayjs from "dayjs";

// 通知数据
const notificationData = ref([
    { id: 1, title: "系统更新", content: "将进行系统更新，预计10分钟内完成", type: "info" },
    { id: 2, title: "紧急维护", content: "由于设备故障，服务器将进行紧急维护", type: "warning" },
]);

// 表格列配置
const columns = ref<TableColumnsType>([
    {title: "通知标题", dataIndex: "title", key: "title", resizable: true , minWidth: 100 },
    {
        title: "通知内容",
        dataIndex: "content",
        key: "content", resizable: true
    },
    {
        title: "开始时间",
        dataIndex: "startTime",
        key: "createTime", resizable: true,
    },
    {
        title: "结束时间",
        dataIndex: "endTime",
        key: "updateTime", resizable: true,
    },
    {
        title: "操作",
        dataIndex: "action",
        key: "action", resizable: true
    },
]);
// 表格列宽拖动
function handleResizeColumn(w, column){
    column.width = w;
}

const loading = ref(false);

const currentPage = ref(1);
const pageSize = ref(10);
// 分页设置
const pagination = computed(() => {
    return {
        current: currentPage.value,
        pageSize: pageSize.value,
        total: notificationData.value.length,
        showTotal: (total) => '共'+total+'条记录',
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
    }
});

// 初始化表单
const getAllNotion = () => {
    loading.value = true;
    try {
        myAxios.get("/notion/getAllNotion").then(res => {
            notificationData.value = res.data.data;
        });
    } catch (error) {
        message.error("获取通知失败");
    } finally {
        loading.value = false;
    }
}

// Modal 控制
const isModalVisible = ref(false);
const formData = ref({
    id: null,
    title: "",
    content: "",
    type: "info",
});
const form = ref(null);

// 打开 Modal 用于新增或编辑
const openModal = () => {
    formData.value = { id: null, title: "", content: "", type: "info" };
    isModalVisible.value = true;
};

// 取消 Modal
const handleCancel = () => {
    isModalVisible.value = false;
};

// 保存或更新通知
const handleOk = () => {
    if (!formData.value.title || !formData.value.content) {
        message.error("标题和内容不能为空");
        return;
    }

    if (formData.value.id) {
        // 更新通知
        const index = notificationData.value.findIndex(notification => notification.id === formData.value.id);
        if (index !== -1) {
            notificationData.value[index] = { ...formData.value };
        }
        message.success("通知更新成功");
    } else {
        // 新增通知
        const newId = notificationData.value.length + 1;
        notificationData.value.push({ id: newId, ...formData.value });
        message.success("通知新增成功");
    }

    isModalVisible.value = false;
};

// 编辑通知
const editNotification = (record: any) => {
    formData.value = { ...record };
    isModalVisible.value = true;
};

// 删除通知
const deleteNotification = (id: number) => {
    Modal.confirm({
        title: "确认删除",
        content: "确认删除该通知吗？",
        onOk() {
            notificationData.value = notificationData.value.filter(notification => notification.id !== id);
            message.success("通知删除成功");
        },
    });
};

onMounted(() => {
    getAllNotion();
});
</script>

<style scoped>
.notification-management {
    padding: 20px;
}

.title {
    font-size: 24px;
    margin-bottom: 20px;
}

.notification-table {
    margin-top: 20px;
}

.modal-content {
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
