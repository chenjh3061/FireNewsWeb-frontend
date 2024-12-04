<template>
    <div>作者管理页面</div>
    <a-layout>
        <a-layout-sider>
            <a-menu v-model:selectedKeys="selectedKeys" mode="inline" theme="dark">
                <a-menu-item key="1">
                    <pie-chart-outlined/>
                    <span>Option 1</span>
                </a-menu-item>
                <a-menu-item key="2">
                    <desktop-outlined/>
                    <span>Option 2</span>
                </a-menu-item>
                <a-sub-menu key="sub1">
                    <template #title>
            <span>
              <user-outlined/>
              <span>User</span>
            </span>
                    </template>
                    <a-menu-item key="3">Tom</a-menu-item>
                    <a-menu-item key="4">Bill</a-menu-item>
                    <a-menu-item key="5">Alex</a-menu-item>
                </a-sub-menu>
                <a-sub-menu key="sub2">
                    <template #title>
            <span>
              <team-outlined/>
              <span>Team</span>
            </span>
                    </template>
                    <a-menu-item key="6">Team 1</a-menu-item>
                    <a-menu-item key="8">Team 2</a-menu-item>
                </a-sub-menu>
                <a-menu-item key="9">
                    <file-outlined/>
                    <span>File</span>
                </a-menu-item>
            </a-menu>
        </a-layout-sider>
        <a-layout-content>
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
        </a-layout-content>
    </a-layout>
</template>

<script lang="ts" setup>
import {ref} from 'vue';
import {InboxOutlined} from '@ant-design/icons-vue';
import type {UploadChangeParam} from 'ant-design-vue';
import {message} from 'ant-design-vue';

const fileList = ref([]);
const selectedKeys = ref([]);
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