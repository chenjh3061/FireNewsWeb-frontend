<template>
    <a-upload-dragger
            v-model:fileList="fileList"
            :multiple="true"
            accept=".doc,.docx,.md,.txt"
            action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
            name="file"
            @change="handleChange"
            @drop="handleDrop"
    >
        <p class="ant-upload-drag-icon">
            <inbox-outlined></inbox-outlined>
        </p>
        <p class="ant-upload-text">点击或拖动要上传的文件到此处</p>
        <p class="ant-upload-hint">
            支持的文件格式：.doc,.docx,.md,.txt，不支持文件夹或批量上传
        </p>
    </a-upload-dragger>
</template>

<script lang="ts" setup>
import {InboxOutlined} from "@ant-design/icons-vue";
import {ref} from "vue";
import {message, UploadChangeParam} from "ant-design-vue";

const fileList = ref([]);
const handleChange = (info: UploadChangeParam) => {
    const status = info.file.status;
    if (status !== 'uploading') {
        console.log(info.file, info.fileList);
    }
    if (status === 'done') {
        message.success(`${info.file.name} file uploaded successfully.`);
    } else if (status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
    }
};

function handleDrop(e: DragEvent) {
    console.log(e);
}
</script>

<style scoped>

</style>