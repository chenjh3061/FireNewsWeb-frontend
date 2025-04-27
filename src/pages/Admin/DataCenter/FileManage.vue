<template>
    <div class="file-manager">
        <!-- 顶部导航栏 -->
            <!-- <div class="title">文件管理</div> -->
        <!-- 头部搜索框 -->
        <div class="header">
            <a-input-search
                v-model:value="searchQuery"
                placeholder="搜索资源名称"
                enter-button="搜索"
                @search="onSearch"
            />
        </div>

        <!-- 文件类型切换标签 -->
        <div class="file-tabs">
            <a-segmented v-model:value="activeTab" :options="tabs" @change="fetchFiles" />
        </div>

        <!-- 文件列表 -->
        <div class="file-grid">
            <!-- 加载中提示 -->
            <div v-if="isLoading" class="loading">
                <a-spin tip="正在加载文件..."></a-spin>
            </div>
            <!-- 无文件提示 -->
            <div v-else-if="files.length === 0" class="no-files">
                暂无文件
            </div>
            <!-- 文件卡片 -->
            <a-card v-else v-for="file in files" :key="file.id" class="file-card" hoverable>
                <!-- 图片文件显示缩略图 -->
                <img v-if="file.fileType === 'image'" :src="file.url" class="file-thumbnail" @click="previewFile(file)" />
                <!-- 非图片文件显示通用图标 -->
                <div v-else class="file-icon">📄</div>
                <div class="file-info">
                    <span>{{ file.name }}</span>
                    <a-dropdown>
                        <a class="ant-dropdown-link" @click.prevent>
                            <MoreOutlined />
                        </a>
                        <template #overlay>
                            <a-menu>
                                <a-menu-item @click="previewFile(file)">查看</a-menu-item>
                                <a-menu-item danger @click="confirmDeleteFile(file)">删除</a-menu-item>
                            </a-menu>
                        </template>
                    </a-dropdown>
                </div>
            </a-card>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { MoreOutlined } from '@ant-design/icons-vue';
import { message, Modal, Spin } from 'ant-design-vue';
import myAxios from '../../../plugins/myAxios';

// 搜索关键字
const searchQuery = ref('');
// 当前激活的文件类型标签
const activeTab = ref('所有');
// 文件列表
const files = ref([]);
// 文件类型标签列表
const tabs = ['所有', '图片', '视频', '音频', '文档'];
// 加载状态
const isLoading = ref(false);

// 获取文件列表
const fetchFiles = async () => {
    isLoading.value = true;
    try {
        const { data } = await myAxios.get('/admin/files', {
            params: {
                type: activeTab.value,
                query: searchQuery.value
            }
        });
        files.value = data.data;
    } catch (error) {
        message.error('获取文件失败');
    } finally {
        isLoading.value = false;
    }
};

// 搜索文件
const onSearch = () => {
    fetchFiles();
};

// 预览文件
import { h } from 'vue';
import { FilePdfTwoTone, FileUnknownTwoTone } from '@ant-design/icons-vue';
import { Button } from 'ant-design-vue';

const previewFile = (file) => {
  let content;

  switch (file.fileType) {
    case 'image':
      content = h('div', { style: { textAlign: 'center' } }, [
        h('img', {
          src: file.url,
          style: {
            maxWidth: '100%',
            maxHeight: '70vh',
            display: 'block',
            margin: '0 auto',
          },
          alt: file.name,
        }),
      ]);
      break;

    case 'video':
      content = h('div', { style: { textAlign: 'center' } }, [
        h('video', {
          controls: true,
          style: {
            maxWidth: '100%',
            maxHeight: '70vh',
            outline: 'none',
          },
        }, [
          h('source', {
            src: file.url,
            type: `video/${file.name.split('.').pop()}`,
          }),
          '您的浏览器不支持视频预览',
        ]),
      ]);
      break;

    case 'audio':
      content = h('div', { style: { padding: '20px' } }, [
        h('audio', {
          controls: true,
          style: { width: '100%' },
        }, [
          h('source', {
            src: file.url,
            type: `audio/${file.name.split('.').pop()}`,
          }),
          '您的浏览器不支持音频播放',
        ]),
      ]);
      break;

    case 'pdf':
      content = h('div', { style: { height: '70vh' } }, [
        h('embed', {
          src: file.url,
          type: 'application/pdf',
          style: {
            width: '100%',
            height: '100%',
            border: 'none',
          },
        }),
      ]);
      break;

    case 'document':
      content = h('div', {
        style: {
          padding: '24px',
          textAlign: 'center',
        },
      }, [
        h(FilePdfTwoTone, { style: { fontSize: '48px', marginBottom: '16px' } }),
        h('p', '文档文件预览需要下载后查看'),
        h('a', {
          href: file.url,
          download: file.name,
        }, [
          h(Button, { type: 'primary' }, { default: () => '下载文档' }),
        ]),
      ]);
      break;

    default:
      content = h('div', {
        style: {
          padding: '24px',
          textAlign: 'center',
        },
      }, [
        h(FileUnknownTwoTone, { style: { fontSize: '48px', marginBottom: '16px' } }),
        h('p', '不支持在线预览此文件类型'),
        h('p', `文件类型: ${file.fileType}`),
        h('a', {
          href: file.url,
          download: file.name,
        }, [
          h(Button, {}, { default: () => '下载文件' }),
        ]),
      ]);
      break;
  }

  Modal.info({
    width: '80%',
    style: { top: '20px' },
    title: h('div', [
      h('span', file.name),
      h('span', {
        style: {
          marginLeft: '8px',
          color: '#888',
          fontSize: '14px',
        },
      }, `(${formatFileSize(file.size)})`),
    ]),
    content,
    okText: '关闭',
    maskClosable: true,
    bodyStyle: { padding: 0 },
  });
};


// 辅助函数：格式化文件大小
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// 确认删除文件
const confirmDeleteFile = (file) => {
    Modal.confirm({
        title: '确认删除',
        content: `确定要删除文件 ${file.name} 吗？`,
        onOk: () => deleteFile(file)
    });
};

// 删除文件
const deleteFile = async (file) => {
    try {
        await myAxios.delete(`/admin/files/${file.id}`);
        message.success('文件已删除');
        fetchFiles();
    } catch (error) {
        message.error('删除失败');
    }
};

// 页面加载时获取文件列表
onMounted(fetchFiles);
</script>

<style scoped>
.file-manager {
    padding: 16px;
}


.header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 16px;
}

.file-tabs {
    margin-bottom: 16px;
}

.file-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 16px;
}

.file-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 12px;
    text-align: center;
}

.file-thumbnail {
    width: 100px;
    height: 100px;
    object-fit: cover;
    cursor: pointer;
}

.file-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    margin-top: 8px;
}

.loading {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 200px;
}

.no-files {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 200px;
    color: #999;
}
</style>