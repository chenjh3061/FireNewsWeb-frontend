<template>
    <div class="personal-page">
        <h1 class="page-title">个人页面</h1>
        <div class="user-profile">
            <!-- 用户资料部分 -->
            <div class="profile-header">
                <img :src="user.userAvatar" alt="Avatar" class="avatar"/>
                <div class="user-info">
                    <h1><span>用户名：</span> {{ user.userName }}</h1>
                    <h2><span>账号：</span>{{ user.userAccount }}</h2>
                    <div class="user-role"><span>身份：</span>{{ user.userRole }}</div>
                    <div class="user-email"><span>邮箱：</span>{{ user.userEmail }}</div>
                    <p class="user-profile-text"><span>用户简介：</span>{{ user.userProfile }}</p>
                </div>
            </div>

            <!-- 用户资料编辑按钮 -->
            <div class="profile-settings">
                <button @click="openEditProfileModal" class="primary-button">编辑资料</button>
                <button @click="openChangePasswordModal" class="secondary-button">修改密码</button>
            </div>

            <!-- 用户动态 -->
            <div class="user-action">
                <h3>最近动态</h3>
                <ul>
                    <li v-for="(action, index) in actions" :key="index" class="user-action-item">
                        <span>{{ action.time }}</span> - {{ action.text }}
                    </li>
                </ul>
            </div>
        </div>

        <!-- 编辑资料弹窗 -->
        <a-modal v-model:visible="editModalVisible" title="编辑资料" @cancel="closeModal" :footer="null">
            <div class="modal-content">
                <div class="modal-input">
                    <label for="userName">用户名：</label>
                    <input id="userName" v-model="editUserName" type="text" placeholder="请输入新用户名" />
                </div>
                <div class="modal-input">
                    <label for="userProfile">简介：</label>
                    <textarea id="userProfile" v-model="editUserProfile" placeholder="请输入个人简介"></textarea>
                </div>
                <div class="modal-footer">
                    <button @click="saveProfileChanges" class="primary-button">保存</button>
                </div>
            </div>
        </a-modal>

        <!-- 修改密码弹窗 -->
        <a-modal v-model:visible="passwordModalVisible" title="修改密码" @cancel="closeModal" :footer="null">
            <div class="modal-content">
                <div class="modal-input">
                    <label for="currentPassword">当前密码：</label>
                    <input id="currentPassword" v-model="currentPassword" type="password" placeholder="请输入当前密码" />
                </div>
                <div class="modal-input">
                    <label for="newPassword">新密码：</label>
                    <input id="newPassword" v-model="newPassword" type="password" placeholder="请输入新密码" />
                </div>
                <div class="modal-input">
                    <label for="confirmPassword">确认密码：</label>
                    <input id="confirmPassword" v-model="confirmPassword" type="password" placeholder="请确认新密码" />
                </div>
                <div class="modal-footer">
                    <button @click="savePasswordChanges" class="primary-button">保存</button>
                </div>
            </div>
        </a-modal>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { Modal } from 'ant-design-vue';

const user = ref({
    userAccount: "john_doe",
    userAvatar: 'https://example.com/avatar.jpg',
    userName: 'JohnDoe',
    userProfile: 'Software Developer at Example Inc.',
    userRole: "user",
    userEmail: 'john.doe@example.com',
});

const actions = ref([
    { time: '2024-12-30 10:00', text: '修改了个人资料' },
    { time: '2024-12-29 18:30', text: '更新了密码' },
    { time: '2024-12-28 15:00', text: '登录了系统' },
]);

// 弹窗控制
const editModalVisible = ref(false);
const passwordModalVisible = ref(false);

// 编辑资料表单
const editUserName = ref(user.value.userName);
const editUserProfile = ref(user.value.userProfile);

// 修改密码表单
const currentPassword = ref('');
const newPassword = ref('');
const confirmPassword = ref('');

// 打开编辑资料弹窗
const openEditProfileModal = () => {
    editModalVisible.value = true;
};

// 打开修改密码弹窗
const openChangePasswordModal = () => {
    passwordModalVisible.value = true;
};

// 关闭弹窗
const closeModal = () => {
    editModalVisible.value = false;
    passwordModalVisible.value = false;
};

// 保存编辑资料
const saveProfileChanges = () => {
    user.value.userName = editUserName.value;
    user.value.userProfile = editUserProfile.value;
    editModalVisible.value = false;
};

// 保存修改密码
const savePasswordChanges = () => {
    if (newPassword.value === confirmPassword.value) {
        console.log('Password updated');
        passwordModalVisible.value = false;
    } else {
        console.error('Passwords do not match');
    }
};
</script>

<style scoped>
/* 页面整体 */
.personal-page {
    max-width: 80vw;
    min-height: 80vh;
    margin: 0 auto;
    padding: 30px;
    background-color: #f0f2f5;  /* 浅灰色背景 */
    border-radius: 15px;
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
}

/* 页面标题 */
.page-title {
    font-size: 32px;
    font-weight: 600;
    color: #333;
    margin-bottom: 20px;
    text-align: center;
    border-bottom: 3px solid #007BFF;
    padding-bottom: 10px;
}

/* 用户资料区 */
.user-profile {
    background: linear-gradient(145deg, #ffffff, #f1f1f1); /* 渐变背景 */
    padding: 30px;
    border-radius: 12px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1); /* 细腻的阴影 */
    margin-top: 20px;
}

/* 头像和用户信息 */
.profile-header {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
}

.avatar {
    border-radius: 50%;
    width: 120px;
    height: 120px;
    margin-right: 20px;
    border: 5px solid #007BFF;
    transition: transform 0.2s ease-in-out; /* 头像动画 */
}

.avatar:hover {
    transform: scale(1.05); /* 头像轻微放大 */
}

.user-info h1,
.user-info h2 {
    font-size: 24px;
    font-weight: 600;
    color: #333;
}

.user-role {
    font-size: 14px;
    font-weight: 600;
    color: #4CAF50;  /* 绿色角色 */
    margin-right: 10px;
}

.user-email {
    font-size: 14px;
    color: #888;
}

.user-profile-text {
    font-size: 16px;
    color: #555;
    line-height: 1.5;
    margin-top: 10px;
}

/* 设置按钮 */
.profile-settings {
    margin-top: 30px;
    display: flex;
    gap: 20px;
    justify-content: center;
}

.profile-settings button {
    padding: 14px 25px;
    font-size: 16px;
    border-radius: 50px;
    cursor: pointer;
    transition: transform 0.3s ease, background-color 0.3s ease; /* 按钮动画 */
}

.primary-button {
    background-color: #007BFF;
    color: white;
    border: none;
}

.primary-button:hover {
    background-color: #0056b3;
    transform: translateY(-3px); /* 按钮悬停时轻微上移 */
}

.secondary-button {
    background-color: #f1f1f1;
    color: #007BFF;
    border: 2px solid #007BFF;
}

.secondary-button:hover {
    background-color: #007BFF;
    color: white;
    transform: translateY(-3px); /* 按钮悬停时轻微上移 */
}

/* 动态区 */
.user-action {
    margin-top: 30px;
}

.user-action h3 {
    font-size: 22px;
    color: #333;
    margin-bottom: 20px;
}

.user-action-item {
    background-color: #fff;
    padding: 12px;
    margin-bottom: 10px;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.modal-content {
    padding: 20px;
}

.modal-input {
    margin-bottom: 20px;
}

.modal-input label {
    display: block;
    font-size: 16px;
    margin-bottom: 8px;
}

.modal-input input, .modal-input textarea {
    width: 100%;
    padding: 10px;
    font-size: 16px;
    border-radius: 8px;
    border: 1px solid #ccc;
}

.modal-footer {
    display: flex;
    justify-content: flex-end;
}
</style>
