<template>
    <div class="category-management">
        <h2>新闻分类管理</h2>

        <!-- 输入和添加分类 -->
        <div class="category-input">
            <a-input
                v-model="newCategory"
                placeholder="请输入新的新闻分类"
                style="width: 300px; margin-right: 16px;"
            />
            <a-button type="primary" @click="addCategory">添加分类</a-button>
        </div>

        <!-- 分类列表表格 -->
        <a-table
            :columns="columns"
            :data-source="categories"
            bordered
            pagination="{ pageSize: 5 }"
            rowKey="category"
            @resizeColumn="handleResizeColumn"
        >
            <template #bodyCell="{ column, record }">
                <template v-if="column.dataIndex === 'action'">
                    <a-button id="action" @click="editCategory(record)">编辑分类</a-button>
                    <a-button id="action" @click="deleteCategory(record)">删除分类</a-button>
                </template>
            </template>
        </a-table>
    </div>
</template>

<script lang="ts" setup>
import {ref} from "vue";
import {message, TableColumnsType} from "ant-design-vue";

// 分类数据
const categories = ref<{ category: string }[]>([
    {category: "时事新闻"},
    {category: "科技新闻"},
    {category: "体育新闻"},
    {category: "娱乐新闻"},
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
    categories.value.push({category: trimmedCategory});
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
        minWidth: 100,
    },
]);
// 表格列宽拖动
function handleResizeColumn(w, column){
    column.width = w;
};
</script>

<style scoped>
.category-management {
    max-width: 800px;
    margin: 20px auto;
    background-color: #fff;
    padding: 16px;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

h2 {
    text-align: center;
    margin-bottom: 16px;
}

.category-input {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 24px;
}
</style>
