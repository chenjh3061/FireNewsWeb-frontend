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
            :data-source="categories"
            bordered
            pagination="{ pageSize: 5 }"
            rowKey="category"
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
    </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { message, TableColumnsType } from "ant-design-vue";

// 分类数据
const categories = ref<{ category: string }[]>([
    { category: "时事新闻" },
    { category: "科技新闻" },
    { category: "体育新闻" },
    { category: "娱乐新闻" },
]);

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
    categories.value.push({ category: trimmedCategory });
    newCategory.value = "";
    message.success("分类添加成功！");
};

// 编辑分类
const editCategory = (category: string) => {
    message.success("编辑分类：" + category);
};

// 删除分类
const deleteCategory = (category: string) => {
    categories.value = categories.value.filter((cat) => cat.category !== category);
    message.success("分类删除成功！");
};

// 表格列配置
const columns = ref<TableColumnsType>([
    {
        title: "分类名称",
        dataIndex: "category",
        key: "category",
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
