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
          @resizeColumn="handleResizeColumn"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'createTime'">
            {{ dayjs(record.createTime).format('YYYY-MM-DD HH:mm') || '未设置' }}
          </template>
          <!-- 操作列：删除按钮 -->
          <template v-if="column.dataIndex === 'action'">
            <a-button type="link" primary @click="showLogModal(record)">查看</a-button>
            <a-popconfirm
                title="确定删除吗？"
                @confirm="() => deleteLog(record.id)"
            >
              <a-button type="link" danger>删除</a-button>
            </a-popconfirm>
          </template>
        </template>
      </a-table>
    </a-card>
  </div>
  <a-modal
      class="log-detail-modal"
      v-model:visible="isLogModalVisible"
      title="日志详情"
  >
    <div v-if="currentLog">
      <p><strong>用户名称：</strong>{{ currentLog.userAccount }}</p>
      <p><strong>请求方式：</strong>{{ currentLog.requestMethod }}</p>
      <p><strong>请求路径：</strong>{{ currentLog.requestPath }}</p>
      <p><strong>业务名称：</strong>{{ currentLog.name }}</p>
      <p><strong>请求 IP：</strong>{{ currentLog.requestIP }}</p>
      <p><strong>创建时间：</strong>{{ formatTime(currentLog.createTime) }}</p>
      <p><strong>请求对象Id：</strong>{{ currentLog.targetId }}</p>
      <p><strong>对象名称：</strong>{{ currentLog.targetName }}</p>
    </div>
    <div v-else>
      无详细信息
    </div>
  </a-modal>

</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import {message, Modal, TableColumnsType} from 'ant-design-vue';
import axios from 'axios';
import dayjs from 'dayjs';
import myAxios from "@/plugins/myAxios";
import { extractIdAndName } from '../../../utils/utils';

// 日志数据、分页、加载状态、选中项
const logs = ref([]);
const loading = ref(false);
const selectedRowKeys = ref<number[]>([]);
const currentPage = ref(1);
const pageSize = ref(20);
const total = ref(0);

// 表格列配置
const columns = ref<TableColumnsType>([
  { title: '用户名称', dataIndex: 'userAccount', key: 'userAccount' , resizable: true},
  { title: '请求方式', dataIndex: 'requestMethod', key: 'requestMethod' , resizable: true},
  { title: '请求路径', dataIndex: 'requestPath', key: 'requestPath' , resizable: true},
  { title: '业务名称', dataIndex: 'name', key: 'name' , resizable: true},
  { title: '请求 IP', dataIndex: 'requestIP', key: 'requestIP' , resizable: true},
  { title: '创建时间', dataIndex: 'createTime', key: 'createTime' , resizable: true},
  { title: '操作', dataIndex: 'action', key: 'action' , resizable: true},
]);

// 表格列宽拖动
const handleResizeColumn = (w, column) => {
  column.width = w;
};

// 分页配置（使用 computed 保持数据联动）
const pagination = computed(() => ({
  current: currentPage.value,
  pageSize: pageSize.value,
  total: logs.value.length,
  showTotal: (total) => `共 ${total} 条记录`,
  showSizeChanger: true,
  pageSizeOptions: ["10", "20", "30", "50"],
  onChange: (page, size) => {
    currentPage.value = page;
    pageSize.value = size;
  },
  onShowSizeChange: (current, size) => {
    currentPage.value = current;
    pageSize.value = size;
  },
}));

// 表格多选配置
const rowSelection = computed(() => ({
  selectedRowKeys: selectedRowKeys.value,
  onChange: (selectedKeys: number[]) => {
    selectedRowKeys.value = selectedKeys;
  },
}));

const isLogModalVisible = ref(false);
const currentLog = ref(null); // 用于存储当前选中的日志数据

const showLogModal = (log) => {
  try {
    const paramStr = typeof log.params === 'string'
        ? log.params
        : JSON.stringify(log.params);

    const shortText = paramStr.slice(0, 250).toString();

    const idandname = extractIdAndName(shortText) || {name: '', id: '' };
    // if (!idandname || !idandname.id || !idandname.name) {
    //   console.error('Failed to extract id and name from params:', shortText);
    //   return;
    // }

    currentLog.value = {
      ...log,
      targetId: idandname.id,
      targetName: idandname.name,
    };
    isLogModalVisible.value = true;
  } catch (error) {
    console.error('Error in showLogModal:', error);
    message.error('显示日志详情时出错');
  }
};


// 从后端获取日志数据（假设接口返回 { records: [...], total: 数字 }）
const fetchLogs = async () => {
  loading.value = true;
  try {
    const res = await myAxios.get('/admin/getRecentLog', {
      params: { page: currentPage.value, size: pageSize.value },
    });
    logs.value = res.data.data;
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
  display: flex;
  justify-content: flex-end;
}
</style>
