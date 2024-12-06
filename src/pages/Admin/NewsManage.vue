<template>
    <div class="news-management">
        <h2 class="title">新闻管理</h2>

        <!-- 操作按钮，点击弹出新闻管理的Modal -->
        <a-button type="primary" @click="openModal">新增新闻</a-button>

        <!-- 新闻列表 -->
        <a-table
            :columns="columns"
            :dataSource="newsData"
            :rowKey="record => record.id"
            class="news-table"
        />

        <!-- 弹窗 - 用于新增或修改新闻 -->
        <a-modal
            v-model:visible="isModalVisible"
            title="新闻编辑"
            @cancel="handleCancel"
            @ok="handleOk"
            :footer="null"
        >
            <div class="modal-content">
                <a-form :form="form">
                    <a-form-item label="新闻标题">
                        <a-input v-model:value="formData.title" />
                    </a-form-item>
                    <a-form-item label="新闻内容">
                        <a-textarea v-model:value="formData.content" rows="4" />
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
import { Modal, Button, Table, Input, Form, message } from "ant-design-vue";

// 新闻数据
const newsData = ref([
    { id: 1, title: "新闻标题 1", content: "新闻内容 1" },
    { id: 2, title: "新闻标题 2", content: "新闻内容 2" },
]);

// 表格列配置
const columns = [
    {
        title: "新闻标题",
        dataIndex: "title",
        key: "title",
    },
    {
        title: "新闻内容",
        dataIndex: "content",
        key: "content",
    },
    {
        title: "操作",
        key: "action",
},
];

// Modal 控制
const isModalVisible = ref(false);
const formData = ref({
    id: 0,
    title: "",
    content: "",
});
const form = ref(null);

// 打开 Modal 用于新增或编辑
const openModal = () => {
    formData.value = {id: undefined, title: "", content: "" };
    isModalVisible.value = true;
};

// 取消 Modal
const handleCancel = () => {
    isModalVisible.value = false;
};

// 保存或更新新闻
const handleOk = () => {
    if (!formData.value.title || !formData.value.content) {
        message.error("标题和内容不能为空");
        return;
    }

    if (formData.value.id) {
        // 更新新闻
        const index = newsData.value.findIndex(news => news.id === formData.value.id);
        if (index !== -1) {
            newsData.value[index] = {id: 1, ...formData.value };
        }
        message.success("新闻更新成功");
    } else {
        // 新增新闻
        const newId = newsData.value.length + 1;
        newsData.value.push({ id: newId, ...formData.value });
        message.success("新闻新增成功");
    }

    isModalVisible.value = false;
};

// 编辑新闻
const editNews = (record: any) => {
    formData.value = { ...record };
    isModalVisible.value = true;
};

// 删除新闻
const deleteNews = (id: number) => {
    newsData.value = newsData.value.filter(news => news.id !== id);
    message.success("新闻删除成功");
};
</script>

<style scoped>
.news-management {
    padding: 20px;
}

.title {
    font-size: 24px;
    margin-bottom: 20px;
}

.news-table {
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
