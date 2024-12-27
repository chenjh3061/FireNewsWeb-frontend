<template>
    <a-modal
        :visible="modalVisible"
        title="文章详情"
        :footer="null"
        @close="closeModal"
        @cancel="closeModal"
    >
        <div v-html="article?.articleContent"></div>
    </a-modal>
</template>

<script setup lang="ts">
import { computed, defineProps, defineEmits } from "vue";

// 定义 props 和 emits
const props = defineProps({
    visible: Boolean, // 父组件传递的 visible
    article: Object, // 父组件传递的文章详情
});

const emit = defineEmits(["update:visible"]); // 定义用于触发的事件

// 计算属性，用于绑定到 `a-modal` 的 visible
const modalVisible = computed({
    get: () => props.visible,
    set: (value: boolean) => emit("update:visible", value),
});

// 关闭弹窗的方法
const closeModal = () => {
    modalVisible.value = false; // 设置 visible 为 false
};
</script>

<style scoped>
/* 样式根据需求自定义 */
</style>
