<template>
  <div class="notification-management">
    <h2 class="title">通知管理</h2>

    <!-- 操作按钮，点击弹出新增通知的Modal -->
    <a-button type="primary" @click="openModal">新增通知</a-button>

    <!-- 通知列表 -->
    <a-table
        :loading="loading"
        :columns="columns"
        :dataSource="notificationData"
        rowKey="id"
        class="notification-table"
        :pagination="pagination"
        @resizeColumn="handleResizeColumn"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'startTime'">
          {{ record.startTime ? dayjs(record.startTime).format('YYYY-MM-DD HH:mm') : '未设置' }}
        </template>
        <template v-if="column.dataIndex === 'endTime'">
          {{ record.endTime ? dayjs(record.endTime).format('YYYY-MM-DD HH:mm') : '未设置' }}
        </template>
        <template v-if="column.dataIndex === 'action'">
          <a-button type="primary" @click="editNotification(record)">编辑</a-button>
          <a-button type="primary" danger @click="deleteNotification(record.id)">删除</a-button>
        </template>
      </template>
    </a-table>

    <!-- 弹窗 - 用于新增或修改通知 -->
    <a-modal
        v-model:visible="isModalVisible"
        title="通知编辑"
        @cancel="handleCancel"
        :footer="null"
    >
      <div class="modal-content">
        <a-form layout="vertical">
          <a-form-item label="通知标题">
            <a-input v-model:value="formData.title" />
          </a-form-item>
          <a-form-item label="通知内容">
            <a-textarea v-model:value="formData.content" rows="4" />
          </a-form-item>
          <a-form-item label="通知类型">
            <a-select v-model:value="formData.type">
              <a-select-option value="info">信息</a-select-option>
              <a-select-option value="warning">警告</a-select-option>
              <a-select-option value="error">错误</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="开始时间">
            <a-date-picker
                v-model:value="formData.startTime"
                valueFormat="YYYY-MM-DDTHH:mm:ss"
                showTime
            />
          </a-form-item>
          <a-form-item label="结束时间">
            <a-date-picker
                v-model:value="formData.endTime"
                valueFormat="YYYY-MM-DDTHH:mm:ss"
                showTime
            />
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
import { ref, computed, onMounted } from "vue";
import { Modal, message } from "ant-design-vue";
import myAxios from "../../plugins/myAxios";
import dayjs from "dayjs";
import {useUserStore} from "../../store/index";

// 通知数据
const notificationData = ref([]);

// 表格列配置
const columns = ref([
  { title: "通知标题", dataIndex: "title", key: "title", resizable: true, minWidth: 100 },
  { title: "通知内容", dataIndex: "content", key: "content", resizable: true },
  { title: "开始时间", dataIndex: "startTime", key: "startTime", resizable: true },
  { title: "结束时间", dataIndex: "endTime", key: "endTime", resizable: true },
  { title: "操作", dataIndex: "action", key: "action", resizable: true },
]);

// 表格列宽拖动
const handleResizeColumn = (w, column) => {
  column.width = w;
};

const loading = ref(false);
const currentPage = ref(1);
const pageSize = ref(10);

// 分页设置
const pagination = computed(() => ({
  current: currentPage.value,
  pageSize: pageSize.value,
  total: notificationData.value.length,
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

// 获取通知数据
const getAllNotion = async () => {
  loading.value = true;
  try {
    const res = await myAxios.get("/notion/getAllNotion");
    // 后端返回 BaseResponse 包装的数据
    notificationData.value = res.data.data || [];
  } catch (error) {
    message.error("获取通知失败");
  } finally {
    loading.value = false;
  }
};

// Modal 控制与表单数据
const isModalVisible = ref(false);
const formData = ref({
  id: null,
  title: "",
  content: "",
  type: "info",
  startTime: dayjs(),
  endTime: dayjs().add(1, "day"),
});

// 打开 Modal（新增/编辑）
const openModal = (record = null) => {
  if (record) {
    // 编辑时对日期字段进行转换
    formData.value = {
      id: record.id,
      title: record.title,
      content: record.content,
      type: record.type,
      startTime: record.startTime ? dayjs(record.startTime) : null,
      endTime: record.endTime ? dayjs(record.endTime) : null,
    };
  } else {
    formData.value = {
      id: null,
      title: "",
      content: "",
      type: "info",
      startTime: dayjs(),
      endTime: dayjs().add(1, "day"),
    };
  }
  isModalVisible.value = true;
};

// 取消 Modal
const handleCancel = () => {
  isModalVisible.value = false;
};

// 保存或更新通知
const handleOk = async () => {
  if (!formData.value.title || !formData.value.content) {
    message.error("标题和内容不能为空");
    return;
  }

  try {
    if (formData.value.id) {
      // 更新通知
      const res = await myAxios.post("/notion/updateNotion", {
        ...formData.value,
        userId: useUserStore().userInfo.id,
        status: 1,
        isDelete: 0,
        // 可在此处添加或转换其他必要字段，例如 userId、status 等
      });
      message.success("通知更新成功");
    } else {
      // 新增通知
      const res = await myAxios.post("/notion/addNotion", {
        ...formData.value,
        userId: useUserStore().userInfo.id,
        status: 1,
        isDelete: 0,
        // 可在此处添加或转换其他必要字段，例如 userId、status 等
      });
      message.success("通知新增成功");
    }
    // 刷新数据
    // await getAllNotion();
  } catch (error) {
    message.error("操作失败");
  }
  isModalVisible.value = false;
};

// 编辑通知
const editNotification = (record) => {
  openModal(record);
};

// 删除通知
const deleteNotification = async (id) => {
  Modal.confirm({
    title: "确认删除",
    content: "确认删除该通知吗？",
    async onOk() {
      try {
        await myAxios.post("/notion/deleteNotion", null, { params: { id } });
        message.success("通知删除成功");
        await getAllNotion();
      } catch (error) {
        message.error("删除通知失败");
      }
    },
  });
};

onMounted(() => {
  getAllNotion();
});
</script>

<style scoped>
.notification-management {
  padding: 20px;
}

.title {
  font-size: 24px;
  margin-bottom: 20px;
}

.notification-table {
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
