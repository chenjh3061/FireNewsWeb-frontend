<template>
    <div class="user-management">
        <h2 class="title">用户管理</h2>

        <!-- 操作按钮，点击弹出用户编辑的Modal -->
        <a-button type="primary" @click="openModal">新增用户</a-button>

        <!-- 用户列表 -->
        <a-table
                :columns="columns"
                :data-source="userData"
                :pagination="pagination"
                @resizeColumn="handleResizeColumn"
        >
            <template #bodyCell="{ column, record }">
                <template v-if="column.dataIndex === 'username'">
                    <div class="user-intro">
                        <a-avatar :src="record.avatar" style="margin-right: 8px;"/>
                        <span>{{ record.username }}</span>
                    </div>
                </template>
                <template v-if="column.dataIndex === 'action'">
                    <a-button id="action" @click="editUser(record)">编辑用户</a-button>
                    <a-button id="action" @click="deleteUser(record)">删除用户</a-button>
                </template>
            </template>

        </a-table>

        <!-- 弹窗 - 用于新增或修改用户 -->
        <a-modal
                v-model:visible="isModalVisible"
                :footer="null"
                title="用户编辑"
                @cancel="handleCancel"
                @ok="handleOk"
        >
            <div class="modal-content">
                <a-form :form="form">
                    <a-form-item label="用户名">
                        <a-input v-model:value="formData.username"/>
                    </a-form-item>
                    <a-form-item label="邮箱">
                        <a-input v-model:value="formData.email"/>
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

<script lang="ts" setup>
import {onMounted, ref} from "vue";
import myAxios from "../../plugins/myAxios";
import type {TableColumnsType} from "ant-design-vue";
import {message, Modal} from "ant-design-vue";

// 用户数据
const userData = ref([]);

const getAllUsers = () => {
    myAxios.get("user/getAllUsers").then((res) => {
        if (res.data) {
            const data = res.data;
            userData.value = data.data;
            console.log(userData.value);
        } else {
            message.error("获取用户数据失败");
        }
    }).catch((err) => {
        message.error(err.toString() + "获取用户数据失败");
    });
}

// 表格列配置
const columns = ref<TableColumnsType>([
    {title: "用户名", dataIndex: "userName", key: "username", resizable: true, minWidth: 100},
    {title: "账号", dataIndex: "userAccount", key: "account", resizable: true, minWidth: 150},
    {title: "密码", dataIndex: "userPassword", key: "password", resizable: true, minWidth: 100},
    {title: "邮箱", dataIndex: "email", key: "email", resizable: true, minWidth: 200},
    {title: "角色", dataIndex: "userRole", key: "role", resizable: true, minWidth: 100},
    {
        title: "操作",
        key: "action",
        dataIndex: "action",
        width: 200,
    },
]);

// 表格列宽拖动
function handleResizeColumn(w, column) {
    column.width = w;
};

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
    id: null,
    username: "",
    avatar: "",
    email: "",
    role: "viewer",
});
const form = ref(null);

// 打开 Modal 用于新增或编辑
const openModal = () => {
    formData.value = {id: null, username: "", avatar: "", email: "", role: "viewer"};
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

    if (formData.value.id) {
        // 更新用户
        const index = userData.value.findIndex(user => user.id === formData.value.id);
        if (index !== -1) {
            userData.value[index] = {...formData.value};
            message.success("用户更新成功");
        }
    } else {
        // 新增用户
        const newId = Math.max(...userData.value.map(user => user.id), 0) + 1;
        userData.value.push({id: newId, ...formData.value});
        message.success("用户新增成功");
    }

    isModalVisible.value = false;
};

// 编辑用户
const editUser = (record: any) => {
    formData.value = {...record};
    isModalVisible.value = true;
};

// 删除用户
const deleteUser = (record: any) => {
    Modal.confirm({
        title: "确认删除",
        content: "确认删除该用户吗？",
        onOk() {
            userData.value = userData.value.filter(user => user.id !== record.id);
            message.success("用户删除成功");
        },
    });
};

onMounted(() => {
    getAllUsers();
});
</script>

<style scoped>
.user-management {
    padding: 20px;
}
.user-intro {
    display: flex;
    align-items: center;
}
.title {
    font-size: 24px;
    margin-bottom: 20px;
}

.ant-table-thead > tr > th {
    background: #f7f7f7;
    cursor: col-resize;
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

.header-cell {
    display: flex;
    align-items: center;
    position: relative;
}

.resize-handle {
    width: 5px;
    height: 100%;
    background: transparent;
    cursor: col-resize;
    position: absolute;
    right: 0;
}

</style>
