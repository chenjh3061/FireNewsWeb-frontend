<template>
  <div
      class="ai-chat-window"
      :style="{
      top: position.top + 'px',
      left: position.left + 'px',
      width: size.width + 'px',
      height: size.height + 'px',
      transform: isMinimized ? 'translateY(calc(100% - 40px))' : 'none'
    }"
  >
    <!-- 窗口标题栏 -->
    <div class="ai-header" @mousedown="startDrag">
      <div class="header-title">
        <a-avatar :size="24" icon="robot" style="background-color: #1890ff" />
        <span>AI助手</span>
      </div>
      <div class="header-actions">
      <a-button
          type="text"
          @click="toggleMinimize"
          class="header-btn"
      >
        <template #icon>
          <minus-outlined v-if="!isMinimized" />
          <plus-outlined v-else />
        </template>
      </a-button>
      <a-button
          type="text"
          class="header-btn"
          @click="$emit('close')"
      >
        <template #icon>
          <close-outlined />
        </template>
      </a-button>
    </div>
    </div>

    <!-- 聊天内容区域 -->
    <div class="ai-content" v-show="!isMinimized" ref="contentArea">
      <!-- 欢迎消息 -->
      <div class="message ai-message">
        <div class="message-avatar">
          <a-avatar icon="robot" style="background-color: #1890ff" />
        </div>
        <div class="message-content">
          <div class="message-text">
            您好！我是AI助手，可以帮您总结这篇文章或回答相关问题。
          </div>
        </div>
      </div>

      <!-- 消息列表 -->
      <div
          v-for="(message, index) in messages"
          :key="index"
          class="message"
          :class="message.type"
      >
        <div class="message-avatar">
          <a-avatar
              :icon="message.type === 'ai-message' ? 'robot' : 'user'"
              :style="{
              backgroundColor:
                message.type === 'ai-message' ? '#1890ff' : '#722ed1'
            }"
          />
        </div>
        <div class="message-content">
          <div class="message-text" v-html="message.text"></div>
          <div class="message-time">{{ formatDate(message.time) }}</div>
        </div>
      </div>

      <!-- 加载状态 -->
      <div v-if="isLoading" class="message ai-message">
        <div class="message-avatar">
          <a-avatar icon="robot" style="background-color: #1890ff" />
        </div>
        <div class="message-content">
          <div class="message-text">
            <a-spin size="small" />
            <span style="margin-left: 8px">思考中...</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 输入区域 -->
    <div class="ai-input" v-show="!isMinimized">
      <a-textarea
          v-model:value="userInput"
          placeholder="输入您的问题..."
          :auto-size="{ minRows: 1, maxRows: 4 }"
          @pressEnter="sendMessage"
      />
      <div class="input-actions">
        <a-button
            type="primary"
            size="small"
            @click="sendMessage"
            :loading="isLoading"
        >
          发送
        </a-button>
        <a-button
            size="small"
            @click="getSummary"
            :loading="isLoading"
            v-if="showSummaryButton"
        >
          总结文章
        </a-button>
      </div>
    </div>

    <!-- 调整大小手柄 -->
    <div class="resize-handle right" @mousedown="startResize('right')"></div>
    <div class="resize-handle bottom" @mousedown="startResize('bottom')"></div>
    <div
        class="resize-handle bottom-right"
        @mousedown="startResize('bottom-right')"
    ></div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, nextTick, watch } from "vue";
import { message } from "ant-design-vue";
import { MinusOutlined, PlusOutlined, CloseOutlined } from '@ant-design/icons-vue';
import { formatDate } from "@/utils/utils";
import myAxios from "../../plugins/myAxios";
import {_} from "lodash";

const props = defineProps({
  articleTitle: String,
  articleContent: String,
  articleId: String,
  initialPosition: {
    type: Object,
    default: () => ({ top: 100, left: 100 }),
  },
  initialSize: {
    type: Object,
    default: () => ({ width: 350, height: 500 }),
  },
  showSummaryButton: {
    type: Boolean,
    default: true,
  },
});

const emit = defineEmits(["close"]);

// 窗口状态
const position = ref({ ...props.initialPosition });
const size = ref({ ...props.initialSize });
const originalSize = ref({ width: 350, height: 500 });
const isMinimized = ref(false);

// 聊天数据
const userInput = ref("");
const messages = ref([]);
const isLoading = ref(false);

// 拖动功能
let isDragging = false;
let dragOffset = { x: 0, y: 0 };

const startDrag = (e) => {
  if (e.target.closest(".header-actions")) return;

  isDragging = true;
  dragOffset = {
    x: e.clientX - position.value.left,
    y: e.clientY - position.value.top,
  };
  document.addEventListener("mousemove", drag);
  document.addEventListener("mouseup", stopDrag);
};

const drag = (e) => {
  if (isDragging) {
    position.value = {
      left: e.clientX - dragOffset.x,
      top: e.clientY - dragOffset.y,
    } as any;
  }
};

const stopDrag = () => {
  isDragging = false;
  document.removeEventListener("mousemove", drag);
  document.removeEventListener("mouseup", stopDrag);
};

// 调整大小功能
let isResizing = false;
let resizeDirection = "";
let startSize = { width: 0, height: 0 };
let startPos = { x: 0, y: 0 };

const startResize = (direction) => {
  isResizing = true;
  resizeDirection = direction;
  startSize = { ...size.value };
  startPos = { x: event.clientX, y: event.clientY };
  document.addEventListener("mousemove", resize);
  document.addEventListener("mouseup", stopResize);
};

const resize = (e) => {
  if (isResizing) {
    const newSize = { ...startSize };
    const deltaX = e.clientX - startPos.x;
    const deltaY = e.clientY - startPos.y;

    if (resizeDirection.includes("right")) {
      newSize.width = Math.max(300, startSize.width + deltaX);
    }
    if (resizeDirection.includes("bottom")) {
      newSize.height = Math.max(200, startSize.height + deltaY);
    }

    size.value = newSize;
  }
};

const stopResize = () => {
  isResizing = false;
  document.removeEventListener("mousemove", resize);
  document.removeEventListener("mouseup", stopResize);
};

// 窗口最小化/最大化
const toggleMinimize = () => {
  if (isMinimized.value) {
    // 恢复原始尺寸
    size.value = { ...originalSize.value };
  } else {
    // 保存当前尺寸并最小化
    originalSize.value = { ...size.value };
    size.value = { width: 200, height: 40 };
  }
  isMinimized.value = !isMinimized.value;
};

// 修改后的消息解析逻辑
const parseAIReponse = (response) => {
  const res = response.data.answer
  try {
    if (response?.data?.answer) {
      
      return response.data.answer.substring(res.indexOf('content=') + 8, res.indexOf(',',res.indexOf('content=') + 8));
    }
    return '无法解析AI响应内容';
  } catch (e) {
    return '响应解析失败';
  }
};

// 添加消息到聊天
const addMessage = (text, type = "user-message") => {
  messages.value.push({
    text,
    type,
    time: new Date(),
  });
  scrollToBottom();
};

// 滚动到底部
const contentArea = ref(null);
const scrollToBottom = () => {
  nextTick(() => {
    if (contentArea.value) {
      contentArea.value.scrollTop = contentArea.value.scrollHeight;
    }
  });
};

// 发送消息
const sendMessage = _.debounce(async () => {
  if (!userInput.value.trim()) return;

  const question = userInput.value;
  addMessage(question, "user-message");
  userInput.value = "";
  isLoading.value = true;

  try {
    const res = await myAxios.post("/ai/askQuestion", {
      messages: [
        {
          userRole: "user",
          content: "你是一位消防记者，请根据文章帮助回答以下问题：\n 问题：" + question + "\n 文章标题：" + props.articleTitle
        },
      ],
    });
    if (res.data?.code === 0) {
      const aiResponse = parseAIReponse(res.data)
      addMessage(aiResponse, "ai-message");
    } else {
      addMessage("抱歉，我无法回答这个问题。", "ai-message");
    }
  } catch (error) {
    console.error("AI回答失败", error);
    addMessage("回答问题时出错，请稍后再试。", "ai-message");
  } finally {
    isLoading.value = false;
  }
}, 500);

// 获取文章总结
const getSummary = _.debounce(async () => {
  if (isLoading.value) return;
  isLoading.value = true;

  try {
    const res = await myAxios.post("/ai/generateSummary", {
      content: "你是一位记者，需要给出下面文章的总结：" + `
        标题：${props.articleTitle}
        内容：${props.articleContent}`,
    });

    if (res.data && res.data.data && res.data.data.summary) {
      const summaryString = res.data.data.summary;
      const contentMatch = summaryString.match(/content=([^,]+)/);
      if (contentMatch && contentMatch[1]) {
        addMessage(contentMatch[1].trim(), "ai-message");
      } else {
        addMessage("无法生成文章总结。", "ai-message");
      }
    } else {
      addMessage("无法生成文章总结。", "ai-message");
    }
  } catch (error) {
    console.error("AI总结生成失败", error);
    addMessage("生成总结时出错，请稍后再试。", "ai-message");
  } finally {
    isLoading.value = false;
  }
}, 500);

// 初始化欢迎消息
onMounted(() => {
  scrollToBottom();
});
</script>

<style scoped>
.ai-chat-window {
  position: fixed;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: all 0.2s ease;
  z-index: 1000;
  border: 1px solid #f0f0f0;
}

.ai-header {
  padding: 8px 12px;
  background-color: #fafafa;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: move;
  user-select: none;
}

.header-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 4px;
}

.header-btn {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(0, 0, 0, 0.45);
  transition: all 0.2s;
  border-radius: 4px;
  margin-left: 0;
}

.header-btn:hover {
  background-color: rgba(0, 0, 0, 0.06);
  color: rgba(0, 0, 0, 0.85);
}

.ai-content {
  flex: 1;
  padding: 12px;
  overflow-y: auto;
  background-color: #f9f9f9;
}

.message {
  display: flex;
  margin-bottom: 16px;
}

.message-avatar {
  margin-right: 12px;
}

.message-content {
  max-width: 80%;
}

.message-text {
  padding: 8px 12px;
  border-radius: 4px;
  line-height: 1.6;
  word-wrap: break-word;
}

.user-message .message-content {
  margin-left: auto;
}

.user-message .message-text {
  background-color: #722ed1;
  color: white;
  border-top-right-radius: 0;
}

.ai-message .message-text {
  background-color: white;
  border: 1px solid #f0f0f0;
  border-top-left-radius: 0;
}

.message-time {
  font-size: 12px;
  color: #999;
  margin-top: 4px;
}

.ai-input {
  padding: 12px;
  border-top: 1px solid #f0f0f0;
  background-color: white;
}

.input-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 8px;
}

.resize-handle {
  position: absolute;
  background: transparent;
  z-index: 10;
}

.resize-handle.right {
  right: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  cursor: e-resize;
}

.resize-handle.bottom {
  bottom: 0;
  left: 0;
  right: 0;
  height: 4px;
  cursor: s-resize;
}

.resize-handle.bottom-right {
  right: 0;
  bottom: 0;
  width: 12px;
  height: 12px;
  cursor: se-resize;
}

.ai-chat-window.minimized {
  height: 40px !important;
  overflow: hidden;
}

.ai-chat-window.minimized .ai-content,
.ai-chat-window.minimized .ai-input {
  display: none;
}

/* 滚动条样式 */
.ai-content::-webkit-scrollbar {
  width: 6px;
}

.ai-content::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.ai-content::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.ai-content::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>