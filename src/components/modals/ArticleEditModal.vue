<!-- ArticleEditModal.vue -->
<template>
    <a-modal
            :visible="isEditVisible"
            :footer="null"
            width="850px"
            title="文章编辑"
            @cancel="handleCancel"
            @ok="handleOk"
    >
        <div class="modal-content">
            <a-form :form="ArticleForm">
                <a-form-item label="文章标题">
                    <a-input v-model:value="article.articleTitle" />
                </a-form-item>

                <a-button @click="startEdit">{{ isEdit ? '切换为可编辑' : '切换为只读' }}</a-button>

                <a-form-item label="文章内容">
                    <jodit-editor :key="jodit" v-model="article.articleContent" />
                </a-form-item>
            </a-form>
            <div class="modal-footer">
                <a-button @click="handleCancel">取消</a-button>
                <a-button type="primary" @click="handleOk">保存</a-button>
            </div>
        </div>
    </a-modal>
</template>

<script lang="ts" setup>
import { ref, defineProps, defineEmits } from "vue";
import JoditEditor from "../../plugins/JoditEditor.vue";

// 定义传入的 Props
const props = defineProps({
    isEditVisible: Boolean,
    article: Object,
});

// 定义发出的事件
const emit = defineEmits(["close", "save", "cancel"]);

// 本地状态
const isEdit = ref(false); // 默认只读状态
const ArticleForm = ref(); // 用于绑定表单
const jodit = ref();
// 切换编辑/只读状态
const startEdit = () => {
    isEdit.value = !isEdit.value;
    jodit.value = isEdit.value;
};

// 取消操作
const handleCancel = () => {
    emit("cancel"); // 通知父组件关闭模态框
    closeModal();
};

// 保存操作
const handleOk = () => {
    emit("save", props.article); // 保存并返回数据
};
const closeModal = () => {
    emit("close");
};

// 更新模态框的可见状态
const updateVisible = (visible: boolean) => {
    emit("update:visible", visible);
};
</script>

<style scoped>
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
