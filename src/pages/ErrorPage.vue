<template>
    <div v-if="errorType">
        <a-result
            :status="errorType"
            :title="errorType"
            :sub-title="errorMessage"
        >
            <template #extra>
                <a-button type="primary" @click="goBack">
                    返回上一页
                </a-button>
            </template>
        </a-result>
    </div>
</template>

<script setup>
import { useErrorStore } from '../store/index.ts'; // 引入Pinia的错误管理store
import { useRouter } from 'vue-router';

const errorStore = useErrorStore();
const router = useRouter();

// 获取错误类型和消息
const { errorType, errorMessage } = errorStore;

const goBack = () => {
    router.back();  // 返回首页
};
</script>

<style scoped>
/* 样式 */
</style>
