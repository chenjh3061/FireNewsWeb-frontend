<!-- UserProfile.vue -->
<template>
    <div class="personal-page">
        <h1 class="page-title">个人页面</h1>
        <div class="user-profile">
            <div class="profile-header">
                <img :src="user.userAvatar" alt="Avatar" class="avatar"/>
                <div class="user-info">
                    <h1>{{ user.userAccount }}</h1>
                    <h2>{{ user.userName }}</h2>
                    <span class="user-role">{{ user.userRole }}</span>
                    <span class="user-email">{{ user.userEmail }}</span>
                    <p>{{ user.userProfile }}</p>
                </div>
            </div>
            <div class="profile-settings">
                <button @click="editProfile">编辑资料</button>
                <button @click="changePassword">修改密码</button>
            </div>
            <div class="user-action">
                动态
            </div>
        </div>
    </div>

</template>

<script lang="ts" setup>
import {ref} from 'vue';

const user = ref({
    userAccount: "john_doe",
    userAvatar: 'https://example.com/avatar.jpg',
    userName: 'JohnDoe',
    userProfile: 'Software Developer at Example Inc.',
    userRole: "user",
    userEmail: 'john.doe@example.com',
});

const editProfile = () => {
    console.log('Editing profile...');
};

const changePassword = () => {
    console.log('Changing password...');
};
</script>

<style scoped>
.personal-page {
    max-width: 70vw;
    min-height: 75vh;
    margin: 0 auto;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.page-title {
    padding: 20px;

}

.user-profile {

    padding: 20px;
}

.profile-header {
    display: flex;
    align-items: center;
}

.avatar {
    border-radius: 50%;
    width: 100px;
    height: 100px;
    margin-right: 20px;
}

.user-info h2 {
    margin: 0;
    font-size: 24px;
}

.user-info p {
    font-size: 14px;
    color: #666;
}

.profile-settings {
    margin-top: 20px;
}

.profile-settings button {
    margin-right: 10px;
    padding: 10px;
    font-size: 16px;
}
</style>
