<!-- UserProfile.vue -->
<template>
    <div class="user-profile">
        <div class="profile-header">
            <img :src="user.avatar" alt="Avatar" class="avatar" />
            <div class="user-info">
                <h2>{{ user.username }}</h2>
                <p>{{ user.bio }}</p>
            </div>
        </div>
        <div class="profile-settings">
            <h3>Account Settings</h3>
            <button @click="editProfile">Edit Profile</button>
            <button @click="changePassword">Change Password</button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const user = ref({
    avatar: 'https://example.com/avatar.jpg',
    username: 'JohnDoe',
    bio: 'Software Developer at Example Inc.',
});

const editProfile = () => {
    console.log('Editing profile...');
};

const changePassword = () => {
    console.log('Changing password...');
};
</script>

<style scoped>
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
