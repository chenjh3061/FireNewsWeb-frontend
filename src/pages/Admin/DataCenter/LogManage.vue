<template>
  <div class="log-management">
    <a-card title="日志管理" class="log-card">
      <!-- 操作栏：批量删除按钮 -->
      <div class="table-operations">
        <a-button
            type="primary"
            danger
            @click="batchDelete"
            :disabled="selectedRowKeys.length === 0"
        >
          批量删除
        </a-button>
      </div>

      <!-- 日志表格 -->
      <a-table
          :columns="columns"
          :dataSource="logs"
          rowKey="id"
          :pagination="pagination"
          :rowSelection="rowSelection"
          :loading="loading"
      >
        <!-- 格式化创建时间 -->
        <template #createTime="{ text }">
          {{ formatTime(text) }}
        </template>
        <!-- 操作列：删除按钮 -->
        <template #action="{ record }">
          <a-popconfirm
              title="确定删除吗？"
              @confirm="() => deleteLog(record.id)"
          >
            <a-button type="link" danger>删除</a-button>
          </a-popconfirm>
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { message, Modal } from 'ant-design-vue';
import axios from 'axios';
import dayjs from 'dayjs';

// 日志数据、分页、加载状态、选中项
const logs = ref([]);
const loading = ref(false);
const selectedRowKeys = ref<number[]>([]);
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);

// 表格列配置
const columns = [
  { title: '用户名称', dataIndex: 'userName', key: 'userName' },
  { title: '请求方式', dataIndex: 'requestMethod', key: 'requestMethod' },
  { title: '请求路径', dataIndex: 'requestPath', key: 'requestPath' },
  { title: '业务名称', dataIndex: 'businessName', key: 'businessName' },
  { title: '请求 IP', dataIndex: 'requestIP', key: 'requestIP' },
  { title: '创建时间', dataIndex: 'createTime', key: 'createTime' },
  { title: '操作', dataIndex: 'action', key: 'action' },
];

// 分页配置（使用 computed 保持数据联动）
const pagination = computed(() => ({
  current: currentPage.value,
  pageSize: pageSize.value,
  total: total.value,
  onChange: (page: number, size: number) => {
    currentPage.value = page;
    pageSize.value = size;
    fetchLogs();
  },
}));

// 表格多选配置
const rowSelection = computed(() => ({
  selectedRowKeys: selectedRowKeys.value,
  onChange: (selectedKeys: number[]) => {
    selectedRowKeys.value = selectedKeys;
  },
}));

// 从后端获取日志数据（假设接口返回 { records: [...], total: 数字 }）
const fetchLogs = async () => {
  loading.value = true;
  try {
    const res = await axios.get('/admin/logs', {
      params: { page: currentPage.value, size: pageSize.value },
    });
    logs.value = res.data.records;
    total.value = res.data.total;
  } catch (error) {
    message.error('获取日志失败');
  } finally {
    loading.value = false;
  }
};

// 格式化时间
const formatTime = (time: string) => dayjs(time).format('YYYY-MM-DD HH:mm:ss');

// 单条删除日志
const deleteLog = async (id: number) => {
  try {
    await axios.delete(`/admin/logs/${id}`);
    message.success('删除成功');
    fetchLogs();
  } catch (error) {
    message.error('删除失败');
  }
};

// 批量删除日志
const batchDelete = () => {
  Modal.confirm({
    title: '确定删除选中的日志吗？',
    onOk: async () => {
      try {
        await axios.delete('/admin/logs/batch', { data: { ids: selectedRowKeys.value } });
        message.success('批量删除成功');
        selectedRowKeys.value = [];
        fetchLogs();
      } catch (error) {
        message.error('批量删除失败');
      }
    },
  });
};

onMounted(() => {
  fetchLogs();
});
</script>

<style scoped>
.log-management {
  background-color: #f0f2f5;
}

.log-card {
  background-color: #fff;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.table-operations {
  margin-bottom: 16px;
  display: flex;
  justify-content: flex-end;
}
</style>
