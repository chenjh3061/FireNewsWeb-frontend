<template>
    <div class="user-management">
        <h2 class="title">用户管理</h2>

        <!-- 操作按钮，点击弹出用户编辑的Modal -->
        <a-button type="primary" @click="openAddModal">新增用户</a-button>

        <!-- 用户搜索 -->
        <a-input-search
            id="search-bar"
            v-model:value="userSearch"
            placeholder="搜索用户"
            enter-button=""
            style="width: 200px"
            @search="onSearch">
            <template #default>
                <a-button type="primary" slot="enterButton">搜索</a-button>
            </template>
        </a-input-search>
        <a-button id="clear-search-bar" type="primary" @click="clearSearchBar" >清空搜索</a-button>


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
                <template v-if="mappings[column.dataIndex]">
                    <a-tag v-bind="mappings[column.dataIndex](record)">
                        {{ mappings[column.dataIndex](record).text }}
                    </a-tag>
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
                    <a-form-item label="账号">
                        <a-input v-model:value="formData.userAccount"/>
                    </a-form-item>
                    <a-form-item label="用户简介">
                        <a-textarea v-model:value="formData.userProfile"/>
                    </a-form-item>
                    <a-form-item label="密码">
                        <a-input-group compact>
                            <a-input-password
                                    v-model:value="formData.userPassword"
                                    v-model:visible="isEditePassword"
                                    style="width: calc(100% - 100px)"
                            />
                            <a-button type="primary" @click="isEditePassword = !isEditePassword">
                                {{ isEditePassword ? '隐藏' : '显示' }}
                            </a-button>
                        </a-input-group>
                    </a-form-item>
                    <a-form-item label="用户头像">
                        <a-avatar :src="formData.userAvatar" style="margin-right: 8px;"/>
                        <a-upload v-model:file-list="fileList" @change="handleUploadChange"
                                  action="http://localhost:8089/upload/img" accept=".png">
                            <a-button @click="ref">上传头像</a-button>
                        </a-upload>
                        <a-input v-model:value="formData.userAvatar"/>
                    </a-form-item>
                    <a-form-item label="用户名">
                        <a-input v-model:value="formData.userAccount"/>
                    </a-form-item>
                    <a-form-item label="邮箱">
                        <a-input v-model:value="formData.email"/>
                    </a-form-item>
                    <a-form-item label="角色">
                        <a-select v-model:value="formData.userRole">
                            <a-select-option value="admin">管理员</a-select-option>
                            <a-select-option value="writer">编辑</a-select-option>
                            <a-select-option value="user">用户</a-select-option>
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
import {computed, onMounted, ref} from "vue";
import myAxios from "../../plugins/myAxios";
import type {TableColumnsType} from "ant-design-vue";
import {message, Modal} from "ant-design-vue";
import { fieldMappings } from "../../utils/mapping.js";
import { Pagination } from "../../utils/Pagination.js";

const mappings = fieldMappings;

// 用户数据
const userData = ref([]);
const pagination = computed(() => {
    return {
        current: 1,
        pageSize: 10,
        total: userData.value.length,
        showTotal: (total) => "共 " + total + " 条数据",
        showSizeChanger: true,
        onChange: (page: number, pageSize: number) => {
            pagination.value.current = page;
            pagination.value.pageSize = pageSize;
            getAllUsers(); // 分页更新时重新请求数据
        },
    }
});



// 获取用户数据
const getAllUsers = () => {
    myAxios
        .get("user/getAllUsers", {
            params: {
                page: pagination.value.current,
                size: pagination.value.pageSize,
            },
        },)
        .then((res) => {
            if (res.data) {
                const data = res.data;
                userData.value = data.data;
                pagination.value.total = data.total; // 更新总页数
                console.log(userData.value);
            } else {
                message.error("获取用户数据失败");
            }
        })
        .catch((err) => {
            message.error(err.toString() + "获取用户数据失败");
        });
};

// 表格列配置
const columns = ref<TableColumnsType>([
    {title: "用户名", dataIndex: "userName", key: "username", resizable: true, minWidth: 100,
        sorter: (a, b) => a.userName.length - b.userName.length,
        sortDirections: ['descend', 'ascend'],},
    {title: "账号", dataIndex: "userAccount", key: "account", resizable: true, minWidth: 150},
    {title: "密码", dataIndex: "userPassword", key: "password", resizable: true, minWidth: 100},
    {title: "邮箱", dataIndex: "email", key: "email", resizable: true, minWidth: 200},
    {title: "角色", dataIndex: "userRole", key: "role", resizable: true, minWidth: 100,

        onFilter: (value, record) => record.userRole?.indexOf(value) === 0,
        sorter: (a, b) => a.userRole.length - b.userRole.length,
        sortDirections: ['descend', 'ascend'],},
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
}

// 搜索用户
const userSearch = ref("");
const onSearch = () => {
    if (userSearch.value) {
        try {
            myAxios.get("/user/getUserByAccount", {
                params: {
                    userAccount: userSearch.value // 传递搜索的用户名
                }
            }).then((res) => {
                if (res.data.code === 0) {
                    const data = res.data;
                    userData.value = data.data; // 更新用户数据
                } else {
                    message.error("搜索用户失败");
                }
            });
        } catch (e) {
            message.error("搜索内容有误");
        }
    } else {
        message.warning("请输入搜索内容");
    }
}

const clearSearchBar = () => {
    userSearch.value = "";
    getAllUsers(); // 清空搜索后重新获取数据
}

// Modal 控制
const isModalVisible = ref(false);
const formData = ref({
    id: 0,
    userAccount: "",
    userPassword: "",
    userProfile: "",
    userAvatar: "",
    email: "",
    userRole: "",
});
const form = ref(null);

const isAdd = ref(false);
// 打开 Modal 用于新增或编辑
const openAddModal = () => {
    formData.value = {
        id: 0,
        userAccount: "",
        userPassword: "",
        userProfile: undefined,
        userAvatar: "",
        email: "",
        userRole: ""
    };
    isAdd.value = true;
    isModalVisible.value = true;
};

// 取消 Modal
const handleCancel = () => {
    isAdd.value = false;
    isModalVisible.value = false;
};
 const fileList = ref([]);
const handleUploadChange = (info) => {
    if (info.file.status === 'done') {
        formData.value.userAvatar = "http://localhost:8089" + info.file.response.data; // 更新头像路径
    } else if (info.file.status === 'error') {
        message.error('上传失败');
    }
};

// 保存或更新用户
const handleOk = () => {
    if (!formData.value.userAccount || !formData.value.userPassword) {
        message.error("账号和密码不能为空");
        return;
    }

    if (formData.value.id) {
        // 更新用户
        myAxios
            .post("user/updateUser", formData.value)
            .then((res) => {
                if (res.data) {
                    message.success("用户更新成功");
                    getAllUsers(); // 更新后重新获取数据
                } else {
                    message.error("用户更新失败");
                }
            })
            .catch((err) => {
                message.error(err.toString() + "用户更新失败");
            });
    } else {
        // 新增用户
        myAxios
            .post("user/addUser", formData.value)
            .then((res) => {
                if (res.data) {
                    message.success("用户新增成功");
                    getAllUsers(); // 新增后重新获取数据
                } else {
                    message.error("用户新增失败");
                }
            })
            .catch((err) => {
                message.error(err.toString() + "用户新增失败");
            });
    }

    isModalVisible.value = false;
};

const isEditePassword = ref<boolean>(false);

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
            myAxios
                .post("user/deleteUser", {id: record.id})
                .then(() => {
                    message.success("用户删除成功");
                    getAllUsers(); // 删除后重新获取数据
                })
                .catch((err) => {
                    message.error(err.toString() + "用户删除失败");
                });
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
