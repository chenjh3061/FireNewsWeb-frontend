<template>
    <div class="category-management">
        <h2>新闻分类管理</h2>

        <!-- 输入和添加分类 -->
        <div class="category-input">
            <a-input
                v-model="newCategory"
                placeholder="请输入新的新闻分类"
                style="width: 300px; margin-right: 16px; border-radius: 8px; box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);"
            />
            <a-button
                type="primary"
                @click="addCategory"
                style="border-radius: 8px; padding: 6px 20px; font-weight: bold; transition: all 0.3s ease;"
                @mouseenter="onButtonHover"
                @mouseleave="onButtonLeave"
            >
                添加分类
            </a-button>
        </div>

        <!-- 分类列表表格 -->
        <a-table
            :columns="columns"
            :loading="loading"
            :data-source="categories"
            bordered
            pagination="{ pageSize: 5 }"
            rowKey="categoryId"
            @resizeColumn="handleResizeColumn"
            class="category-table"
        >
            <template #bodyCell="{ column, record }">
                <template v-if="column.dataIndex === 'action'">
                    <a-button
                        @click="editCategory(record)"
                        class="action-button"
                        style="margin-right: 8px; background-color: #1890ff; color: #fff; border-radius: 8px;"
                    >
                        编辑分类
                    </a-button>
                    <a-button
                        @click="deleteCategory(record)"
                        class="action-button"
                        style="background-color: #f5222d; color: #fff; border-radius: 8px;"
                    >
                        删除分类
                    </a-button>
                </template>
            </template>
        </a-table>

        <!-- 编辑分类模态框 -->
        <a-modal
            v-model:visible="isEditModalVisible"
            title="编辑分类"
            @ok="submitEdit"
            @cancel="closeEditModal"
        >
            <a-input v-model="editedCategory" placeholder="请输入新的分类名称" />
        </a-modal>
    </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { message, TableColumnsType } from "ant-design-vue";
import myAxios from "../../plugins/myAxios";

const loading = ref(false);

// 分类数据
const categories = ref();

const getCategory = () => {
    loading.value = true;
    try {
        myAxios.get("/categories/getAllCategories").then(res => {
            if (res.data.code === 0){
                categories.value = res.data.data;
            } else {
                message.error(res.data.message)
            }
        })
    } catch (e) {
        message.error(e)
    } finally {
        loading.value = false;
    }
};
getCategory();

// 新分类名称
const newCategory = ref<string>("");

// 添加分类
const addCategory = () => {
    const trimmedCategory = newCategory.value.trim();
    if (!trimmedCategory) {
        message.warning("分类名称不能为空！");
        return;
    }
    if (categories.value.some((cat) => cat.category === trimmedCategory)) {
        message.warning("该分类已存在！");
        return;
    }
    loading.value = true;

    myAxios.post("/categories/addCategory", { category: trimmedCategory })
        .then(res => {
            if (res.data.code === 0) {
                message.success("分类添加成功！");
                getCategory();
            } else {
                message.error(res.data.message);
            }
            loading.value = false;
        })
        .catch(e => {
            message.error("添加分类失败");
            loading.value = false;
        });
    newCategory.value = "";
};

// 编辑分类模态框相关
const isEditModalVisible = ref(false);
const editedCategory = ref("");
const currentEditCategoryId = ref(null);

// 打开编辑分类模态框
const editCategory = (category: any) => {
    editedCategory.value = category.category;
    currentEditCategoryId.value = category.categoryId;
    isEditModalVisible.value = true;
};

// 提交编辑
const submitEdit = () => {
    const trimmedCategory = editedCategory.value.trim();
    if (!trimmedCategory) {
        message.warning("分类名称不能为空！");
        return;
    }
    loading.value = true;
    myAxios.post("/categories/editCategory", {
        categoryId: currentEditCategoryId.value,
        category: trimmedCategory
    })
        .then(res => {
            if (res.data.code === 0) {
                message.success("分类编辑成功！");
                getCategory();
                closeEditModal();
            } else {
                message.error(res.data.message);
            }
            loading.value = false;
        })
        .catch(e => {
            message.error("编辑分类失败");
            loading.value = false;
        });
};

// 关闭编辑分类模态框
const closeEditModal = () => {
    isEditModalVisible.value = false;
    editedCategory.value = "";
    currentEditCategoryId.value = null;
};

// 删除分类
const deleteCategory = (category: any) => {
    loading.value = true;
    myAxios.post("/categories/deleteCategory", { categoryId: category.categoryId })
        .then(res => {
            if (res.data.code === 0) {
                message.success("分类删除成功！");
                getCategory();
            } else {
                message.error(res.data.message);
            }
            loading.value = false;
        })
        .catch(e => {
            message.error("删除分类失败");
            loading.value = false;
        });
};

// 表格列配置
const columns = ref<TableColumnsType>([
    {
        title: "分类名称",
        dataIndex: "name",
        key: "name",
        resizable: true,
        minWidth: 100,
    },
    {
        title: "操作",
        key: "action",
        dataIndex: "action",
        resizable: true,
        minWidth: 150,
    },
]);
// 表格列宽拖动
function handleResizeColumn(w, column) {
    column.width = w;
}

// 按钮悬停效果
const onButtonHover = (e: MouseEvent) => {
    const button = e.target as HTMLButtonElement;
    button.style.transform = "scale(1.05)";
};

const onButtonLeave = (e: MouseEvent) => {
    const button = e.target as HTMLButtonElement;
    button.style.transform = "scale(1)";
};

// const downloadFile = async (filePath) => {
//     const response = await axios({
//         url: `/api/download?filePath=${encodeURIComponent(filePath)}`,  // 注意 URL 编码
//         method: 'GET',
//         responseType: 'blob'  // 让返回值作为二进制数据处理
//     });
//
//     // 生成下载链接
//     const blob = response.data;
//     const link = document.createElement('a');
//     const url = window.URL.createObjectURL(blob);
//     link.href = url;
//     link.download = filePath.split('/').pop();  // 获取文件名
//     link.click();
//     window.URL.revokeObjectURL(url);  // 清除 URL 对象
// };

</script>

<style scoped>
.category-management {
    max-width: 900px;
    margin: 20px auto;
    background-color: #fff;
    padding: 24px;
    border-radius: 16px;
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.1);
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

h2 {
    text-align: center;
    font-size: 28px;
    font-weight: bold;
    color: #333;
    margin-bottom: 24px;
}

.category-input {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 32px;
}

.category-input .ant-input {
    font-size: 16px;
    border-radius: 8px;
    padding: 8px;
    margin-right: 16px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.category-input .ant-btn {
    font-size: 16px;
    font-weight: bold;
    padding: 8px 20px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transition: background-color 0.3s ease, transform 0.3s ease;
}

.category-input .ant-btn:hover {
    background-color: #1890ff;
}

.category-table .ant-table-thead > tr > th {
    background-color: #f7f7f7;
    color: #333;
    font-weight: 600;
    font-size: 16px;
    border-radius: 8px;
}

.category-table .ant-table-tbody > tr > td {
    font-size: 14px;
    color: #555;
    padding: 12px;
}

.category-table .ant-table-cell {
    border-top: 1px solid #f0f0f0;
    border-bottom: 1px solid #f0f0f0;
}

.category-table .action-button {
    border-radius: 8px;
    padding: 6px 12px;
    transition: transform 0.3s ease;
}

.category-table .action-button:hover {
    transform: translateY(-2px);
}

.category-table .ant-btn-primary {
    background-color: #1890ff;
    border-color: #1890ff;
}

.category-table .ant-btn-danger {
    background-color: #f5222d;
    border-color: #f5222d;
}

.ant-table-pagination {
    margin-top: 24px;
    text-align: center;
}

.ant-table-pagination .ant-pagination-item-link {
    color: #0078d4;
    transition: color 0.3s ease;
}

.ant-table-pagination .ant-pagination-item-link:hover {
    color: #005a99;
}
</style>
