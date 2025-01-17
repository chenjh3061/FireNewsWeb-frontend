<template>
    <div class="personal-page">
        <h1 class="page-title">个人页面</h1>

        <div v-if="isLoggedIn">

            <!-- 用户资料部分 -->
            <div class="user-profile">

                <div class="profile-header">
                    <img :src="user.userAvatar" alt="Avatar" class="avatar"/>
                    <div class="user-info">
                        <h1><span>用户名：</span> {{ user.userAccount }}</h1>
                        <h2><span>账号：</span>{{ user.userAccount }}</h2>
                        <div class="user-role"><span>身份：</span>{{ user.userRole }}</div>
                        <div class="user-email"><span>邮箱：</span>{{ user.userEmail }}</div>
                        <p class="user-profile-text"><span>用户简介：</span>{{ user.userProfile }}</p>
                    </div>
                </div>
            </div>

            <!-- 用户资料编辑按钮 -->
            <div class="profile-settings">
                <button class="primary-button" @click="openEditProfileModal">编辑资料</button>
                <button class="secondary-button" @click="openChangePasswordModal">修改密码</button>
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
        <a-modal v-model:visible="editModalVisible" :footer="null" title="编辑资料" @cancel="closeModal">
            <a-form class="modal-content" v-model:value="user">
                <a-form-item class="modal-input">
                    <label for="userName">用户名：</label>
                    <a-input id="userName" v-model:value="user.userName" placeholder="请输入新用户名" type="text"/>
                </a-form-item>
                <a-form-item class="modal-input">
                    <label for="userAvatar">头像:</label>
                    <a-input id="userAvatar" v-model:value="user.userAvatar" placeholder="请输入新头像链接或上传头像" type="text"/>
                    <a-upload v-model:file-list="fileList" @change="handleUploadChange"
                              action="http://localhost:8089/upload" accept=".png">
                        <a-button @click="ref">上传头像</a-button>
                        <img :src="user.userAvatar"  alt="预览"/>
                    </a-upload>
                </a-form-item>
                <a-form-item class="modal-input">
                    <label for="userEmail">邮箱：</label>
                    <a-input id="userEmail" v-model:value="user.email" placeholder="请输入新邮箱" type="email"/>
                </a-form-item>
                <a-form-item class="modal-input">
                    <label for="userProfile">简介：</label>
                    <a-textarea id="userProfile" v-model:value="user.userProfile" placeholder="请输入个人简介"></a-textarea>
                </a-form-item>
                <a-form-item class="modal-footer">
                    <button class="primary-button" @click="saveChanges">保存</button>
                </a-form-item>
            </a-form>
        </a-modal>

        <!-- 修改密码弹窗 -->
        <a-modal v-model:visible="passwordModalVisible" :footer="null" title="修改密码" @cancel="closeModal">
            <div class="modal-content">
                <div class="modal-input">
                    <label for="currentPassword">当前密码：</label>
                    <input id="currentPassword" v-model="currentPassword" placeholder="请输入当前密码" type="password"/>
                </div>
                <div class="modal-input">
                    <label for="newPassword">新密码：</label>
                    <input id="newPassword" v-model="newPassword" placeholder="请输入新密码" type="password"/>
                </div>
                <div class="modal-input">
                    <label for="confirmPassword">确认密码：</label>
                    <input id="confirmPassword" v-model="confirmPassword" placeholder="请确认新密码" type="password"/>
                </div>
                <div class="modal-footer">
                    <button class="primary-button" @click="savePasswordChanges">保存</button>
                </div>
            </div>
        </a-modal>

        <!-- 未登录提示 -->
        <div v-if="!isLoggedIn" class="not-login-tip">
            <p>请登录后查看个人页面</p>
            <a-button class="primary-button">登录</a-button>
        </div>
    </div>
</template>

<script lang="ts" setup>
import {onMounted, ref} from 'vue';
import {useUserStore} from "../store/index";
import {message} from "ant-design-vue";
import myAxios from "../plugins/myAxios";
import {getLoginUser} from "../router/index";

const user = ref({
    userAccount: "john_doe",
    userName: "joho",
    userAvatar: 'https://example.com/avatar.jpg',
    userProfile: 'Software Developer at Example Inc.',
    userRole: "user",
    email: 'john.doe@example.com',
});

const userStore = useUserStore();
user.value = userStore.userInfo;

const fileList = ref([]);

const handleUploadChange = (info) => {
    if (info.file.status === 'done') {
        user.value.userAvatar = "http://localhost:8089" + info.file.response.data; // 更新头像路径
    } else if (info.file.status === 'error') {
        message.error('上传失败');
    }
};

const actions = ref([
    {time: '2024-12-30 10:00', text: '修改了个人资料'},
    {time: '2024-12-29 18:30', text: '更新了密码'},
    {time: '2024-12-28 15:00', text: '登录了系统'},
]);

const isLoggedIn = ref(false);

// 弹窗控制
const editModalVisible = ref(true);
const passwordModalVisible = ref(false);

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
const saveChanges = () => {
    try {
     myAxios.post('/user/updateUserByUser', user.value).then(res => {
         userStore.userInfo = (res.data);
         message.success('更新成功');
     }).catch(err => {
         console.log(err);
         message.error('更新失败');
     });

    } catch (error) {
        console.error('Error updating profile');
    }
    editModalVisible.value = false;
};

// 保存修改密码
const savePasswordChanges = () => {
    if (!currentPassword.value || !newPassword.value || !confirmPassword.value){
        message.error("请完善表单");
    } else if (newPassword.value === confirmPassword.value) {
        try {
            myAxios.post("/user/updatePassword").then(res => {
                if (res.data.code === 0){
                    message.info("修改成功")
                } else {
                    message.error("修改失败")
                }
            });
        } catch (e){
            console.log(e);
        }
        console.log('Password updated');
        passwordModalVisible.value = false;
    } else {
        console.error('Passwords do not match');
    }
};

onMounted(() => {
    getLoginUser();
    console.log(isLoggedIn.value)
    isLoggedIn.value = !!userStore?.userInfo?.token;
});
</script>

<style scoped>
/* 页面整体 */
.personal-page {
    max-width: 80vw;
    min-height: 80vh;
    margin: 0 auto;
    padding: 30px;
    background-color: #f0f2f5; /* 浅灰色背景 */
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
    color: #4CAF50; /* 绿色角色 */
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
    margin-bottom: 10px;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.modal-content {
}

.modal-input {
    margin-bottom: 20px;
    img{
        max-width: 50%;
        max-height: 15rem;
        height: auto;
        margin: auto auto auto 3rem;
        border-radius: 50%;
    }
}

.modal-input label {
    display: block;
    font-size: 16px;
    margin-bottom: 8px;
}

.modal-input input, .modal-input textarea {
    width: 100%;
    font-size: 16px;
    border-radius: 8px;
    border: 1px solid #ccc;
}

.modal-footer {
    display: flex;
    justify-content: flex-end;
}
</style>
