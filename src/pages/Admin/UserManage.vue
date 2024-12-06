<template>
    <div class="user-management">
        <h2 class="title">用户管理</h2>

        <!-- 操作按钮，点击弹出用户编辑的Modal -->
        <a-button type="primary" @click="openModal">新增用户</a-button>

        <!-- 用户列表 -->
        <a-table
                :columns="columns"
                :dataSource="userData"
                :rowKey="record => record.id"
                class="user-table"
                :pagination="pagination"
        />

        <!-- 弹窗 - 用于新增或修改用户 -->
        <a-modal
                v-model:visible="isModalVisible"
                title="用户编辑"
                @cancel="handleCancel"
                @ok="handleOk"
                :footer="null"
        >
            <div class="modal-content">
                <a-form :form="form">
                    <a-form-item label="用户名">
                        <a-input v-model:value="formData.username" />
                    </a-form-item>
                    <a-form-item label="邮箱">
                        <a-input v-model:value="formData.email" />
                    </a-form-item>
                    <a-form-item label="角色">
                        <a-select v-model:value="formData.role">
                            <a-select-option value="admin">管理员</a-select-option>
                            <a-select-option value="editor">编辑</a-select-option>
                            <a-select-option value="viewer">查看者</a-select-option>
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
import { ref } from "vue";
import { Modal, Button, Table, Input, Form, message, Select, SelectOption } from "ant-design-vue";

// 用户数据
const userData = ref([
    { id: 1, username: "张三", email: "zhangsan@example.com", role: "admin" },
    { id: 2, username: "李四", email: "lisi@example.com", role: "editor" },
]);

// 表格列配置
const columns = [
    {
        title: "用户名",
        dataIndex: "username",
        key: "username",
    },
    {
        title: "邮箱",
        dataIndex: "email",
        key: "email",
    },
    {
        title: "角色",
        dataIndex: "role",
        key: "role",
    },
    {
        title: "操作",
        key: "action",
},
];

// 分页设置
const pagination = ref({
    current: 1,
    pageSize: 10,
    total: userData.value.length,
    onChange: (page: number, pageSize: number) => {
        pagination.value.current = page;
        pagination.value.pageSize = pageSize;
    },
});

// Modal 控制
const isModalVisible = ref(false);
const formData = ref({
    username: "",
    email: "",
    role: "viewer",
});
const form = ref(null);

// 打开 Modal 用于新增或编辑
const openModal = () => {
    formData.value = { username: "", email: "", role: "viewer" };
    isModalVisible.value = true;
};

// 取消 Modal
const handleCancel = () => {
    isModalVisible.value = false;
};

// 保存或更新用户
const handleOk = () => {
    if (!formData.value.username || !formData.value.email) {
        message.error("用户名和邮箱不能为空");
        return;
    }

    if (formData.value.username) {
        // 更新用户
        const index = userData.value.findIndex(user => user.id === formData.value.username);
        if (index !== -1) {
            userData.value[index] = {id: 2, ...formData.value };
        }
        message.success("用户更新成功");
    } else {
        // 新增用户
        const newId = userData.value.length + 1;
        userData.value.push({ id: newId, ...formData.value });
        message.success("用户新增成功");
    }

    isModalVisible.value = false;
};

// 编辑用户
const editUser = (record: any) => {
    formData.value = { ...record };
    isModalVisible.value = true;
};

// 删除用户
const deleteUser = (id: number) => {
    Modal.confirm({
        title: "确认删除",
        content: "确认删除该用户吗？",
        onOk() {
            userData.value = userData.value.filter(user => user.id !== id);
            message.success("用户删除成功");
        },
    });
};
</script>

<style scoped>
.user-management {
    padding: 20px;
}

.title {
    font-size: 24px;
    margin-bottom: 20px;
}

.user-table {
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
