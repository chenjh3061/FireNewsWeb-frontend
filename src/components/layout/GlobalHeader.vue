<template>
    <div id="indexHeader">
        <div id="upperLine"></div>
        <div id="logo">
            <img src="../../assets/Logo.png" alt="logo">
        </div>
        <span id="title">消防新闻网</span>
        <ul id="navMenu" >
            <li v-for="item in menuRoutes">
                <router-link :to="item.path" active-class="active">{{ item.meta.title }}</router-link>
            </li>
        </ul>
        <div id="login" v-if="!userStore?.userInfo?.token">
            <button @click="openLoginModal"><span>登录</span></button>
        </div>
        <div id="userInfo" v-else>
            <div class="user-avatar" @click="toggleDropdown">
                <img :src="userStore?.userInfo?.userAvatar" alt="1"/>
                <span>{{ userStore?.userInfo?.userName }}</span>
            </div>
            <div v-if="isDropdownVisible" class="dropdown-menu">
                <ul>
                    <li @click="goToProfile">个人中心</li>
                    <li @click="handleLogout">退出登录</li>
                </ul>
            </div>
        </div>

        <!-- 登录/注册模态框 -->
        <login-modal
            :visible="isLoginModalVisible"
            @close="isLoginModalVisible = false"
            v-model="loginForm"
            @login="handleLogin"
        ></login-modal>
    </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "../../store/index";
import LoginModal from "@/components/modals/LoginModal.vue";
import myAxios from "../../plugins/myAxios";

const isLoginModalVisible = ref(false);

const router = useRouter();
const userStore = useUserStore();

// 过滤需要的导航路由（只显示一级路由，并且包含 meta.title）
const menuRoutes = router.options.routes.filter(route => route.meta && route.meta.title);

// 登录表单
const loginForm = ref({
    userName: "",
    password: ""
});

const openLoginModal = () => {
    isLoginModalVisible.value = true;
    console.log(isLoginModalVisible.value);
};

// 登录请求
const handleLogin = async () => {
    try {
        const response = await myAxios.post("/user/login", loginForm.value);
        if (response.data.success) {
            // 登录成功后可以做一些操作，比如跳转到首页或者展示用户信息
            alert("登录成功");
            isLoginModalVisible.value = false;  // 关闭模态框
        } else {
            alert("登录失败：" + response.data.message);
        }
    } catch (error) {
        alert("登录失败，请检查网络连接");
    }
};
const isDropdownVisible = ref(false);
// 切换下拉菜单的显示状态
const toggleDropdown = () => {
    isDropdownVisible.value = !isDropdownVisible.value;
};

// 跳转到个人中心
const goToProfile = () => {
    router.push("/user"); // 假设个人中心的路由是 "/profile"
    isDropdownVisible.value = false;
};

// 退出登录
const handleLogout = async () => {
    try {
        const response = await myAxios.post('/user/logout',null,
            {headers: {'token': userStore.userInfo?.token}});
        if (response.data.code === 0) {
            userStore.$state.userInfo = null; // 清空用户信息
            userStore.$reset(); // 重置用户信息，例如清除token等
            await router.push('/'); // 跳转到登录页
            alert('已退出登录');
        } else {
            if (response.data.message === "未登录"){
                userStore.$state.userInfo = null; // 清空用户信息
                userStore.$reset(); // 重置用户信息，例如清除token等
                await router.push('/'); // 跳转到登录页
            }
            alert('退出登录失败');
        }
    } catch (error) {
        alert('网络错误，退出失败');
    } finally {
        isDropdownVisible.value = false;
    }
};
</script>

<style scoped>
#indexHeader {
    height: 10vh;
    display: flex;
    align-items: center;
    background: linear-gradient(0deg, #3c288c, #5a47b5);
    padding: 0 20px;
    box-sizing: border-box;
    box-shadow: 0 2px 15px rgba(0, 0, 0, 0.3);
    border-radius: 0 0 15px 15px;
}

#upperLine {
    width: 68%;
    height: 3%;
    top: 0;
    display: block;
    position: absolute;
    margin: 0 5%;
    background: linear-gradient(0deg, #ff5e3a, #ff7b54);
    transform: perspective(.8em) rotateX(-1deg);
    border-radius: 5px;
}
#logo {
    width: 90px;
    height: auto;
    color: #fff;
    font-size: 20px;
    margin-right: 40px;
    display: inline-block;
}

#logo img {
    display: block;
    width: 100px;
    height: 100px;
    border-radius: 50%;
    object-fit: cover;
    border: 1px solid #1f607e;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

#logo img:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.5);
}

#title {
    color: #fff;
    font-size: 38px;
    margin-top: 1%;
    font-weight: bold;
    font-family: "Arial Black", sans-serif;
    margin-right: auto; /* 将标题推到中间 */
    -webkit-text-stroke: 1px #ff5e3a; /* 描边效果 */
    text-shadow: 2px -1px 10px rgba(0, 0, 0, 0.3);
}

#navMenu {
    list-style: none;
    display: flex;
    gap: 20px; /* 菜单项间距 */
    margin: 1% 10% 0 0;
    padding: 0;
    z-index: 2;
}

#navMenu li {
    display: inline;
    position: relative;
}

#navMenu a {
    color: #fff;
    text-decoration: none; /* 去掉下划线 */
    font-size: 16px;
    padding: 5px 10px; /* 增加点击区域 */
    transition: all 0.3s ease; /* 增加悬浮过渡效果 */
}

#navMenu a:hover {
    background-color: #5a47b5; /* 鼠标悬浮背景色 */
    border-radius: 5px; /* 圆角效果 */
}
#navMenu a::after {
    content: "";
    display: block;
    bottom: -5px;
    width: 0;
    height: 2px;
    background: #ff7b54;
    transition: width 0.3s;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
}

#navMenu a:hover::after {
    width: 100%;
}

#navMenu a.active {
    background: linear-gradient(90deg, #ff7b54, #ffc154); /* 渐变背景色 */
    border-radius: 10px; /* 圆角让效果更柔和 */
    font-weight: bold; /* 突出选中文字 */
    color: #fff; /* 确保文字清晰可见 */
    box-shadow: 0 4px 10px rgba(255, 123, 84, 0.6); /* 添加阴影效果 */
    padding: 6px 12px; /* 增加点击区域 */
    transition: all 0.3s ease; /* 平滑过渡 */
}
#navMenu a.active:hover {
    background: linear-gradient(90deg, #ff9068, #ffc154); /* 悬停时调整渐变 */
    box-shadow: 0 6px 15px rgba(255, 123, 84, 0.8); /* 阴影更强 */
    transform: scale(1.05); /* 微缩放提升视觉反馈 */
}

#login button {
    background: linear-gradient(90deg, #ff7b54, #ffc154); /* 按钮渐变背景 */
    border: none;
    font-weight: bold;
    color: #fff; /* 字体颜色为白色 */
    padding: 10px 20px; /* 按钮内边距，增加舒适感 */
    border-radius: 25px; /* 圆角按钮 */
    box-shadow: 0 4px 10px rgba(255, 123, 84, 0.3); /* 按钮的柔和阴影 */
    cursor: pointer; /* 鼠标悬浮显示为点击手型 */
    transition: all 0.3s ease; /* 增加动态效果 */
}

#login {
    display: flex;
    margin-top: 1%;
}

#login button:hover {
    background: linear-gradient(90deg, #ff9068, #ffe29a); /* 悬停时的渐变变化 */
    box-shadow: 0 6px 15px rgba(255, 123, 84, 0.5); /* 加强悬停时的阴影 */
    transform: translateY(-2px); /* 按钮悬停时轻微上移，增加悬浮感 */
}

#login button:active {
    background: linear-gradient(90deg, #ff7b54, #ffc154); /* 按下时恢复原样 */
    box-shadow: 0 2px 5px rgba(255, 123, 84, 0.4); /* 阴影变小，模拟按压感 */
    transform: translateY(2px); /* 按下时轻微下移 */
}

#userInfo {
    display: flex;
    align-items: center;
    gap: 10px; /* 用户信息和按钮之间的间距 */
    margin-right: 10px; /* 右侧外边距，与按钮保持一定距离 */
    position: relative;
}
.user-avatar {
    display: flex;
    align-items: center;
    gap: 10px;
    cursor: pointer;
}

.user-avatar img {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    object-fit: cover;
}

.user-avatar span {
    color: #fff;
    font-size: 16px;
}

/* 下拉菜单 */
.dropdown-menu {
    position: absolute;
    top: 100%;
    right: 0;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    width: 150px;
    margin-top: 10px;
    z-index: 10;
    display: none;
    /* 默认不显示，点击头像时才会显示 */
}

.dropdown-menu ul {
    padding: 0;
    margin: 0;
    list-style: none;
}

.dropdown-menu li {
    padding: 10px;
    color: #333;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.dropdown-menu li:hover {
    background-color: #f5f5f5;
}

/* 显示下拉菜单 */
#userInfo .dropdown-menu {
    display: block;
}

#navMenu {
    list-style: none;
    display: flex;
    gap: 20px; /* 菜单项间距 */
    margin: 1% 10% 0 0;
    padding: 0;
    z-index: 2;
    flex-wrap: wrap; /* 确保在小屏幕时，菜单项能自动换行 */
}

#navMenu li {
    display: inline-block; /* 改为 inline-block 保持在行内 */
    position: relative;
}

#navMenu a {
    color: #fff;
    text-decoration: none; /* 去掉下划线 */
    font-size: 16px;
    padding: 5px 10px; /* 增加点击区域 */
    transition: all 0.3s ease; /* 增加悬浮过渡效果 */
}

#navMenu a:hover {
    background-color: #5a47b5; /* 鼠标悬浮背景色 */
    border-radius: 5px; /* 圆角效果 */
}

#login button {
    background: linear-gradient(90deg, #ff7b54, #ffc154); /* 按钮渐变背景 */
    border: none;
    font-weight: bold;
    color: #fff; /* 字体颜色为白色 */
    padding: 10px 20px; /* 按钮内边距，增加舒适感 */
    border-radius: 25px; /* 圆角按钮 */
    box-shadow: 0 4px 10px rgba(255, 123, 84, 0.3); /* 按钮的柔和阴影 */
    cursor: pointer; /* 鼠标悬浮显示为点击手型 */
    transition: all 0.3s ease; /* 增加动态效果 */
    min-width: 120px; /* 设置最小宽度，确保按钮不会过小 */
}

@media (max-width: 768px) {
    #indexHeader {
        flex-direction: column; /* 保持 header 内部元素垂直排列 */
        align-items: center; /* 居中对齐 */
        height: auto; /* 高度自动适应内容 */
        padding: 10px 20px;
    }

    #logo {
        position: absolute;
        margin-left: 0;
        display: none;
    }

    #logo img {
        width: 70px; /* 调整 Logo 尺寸 */
        height: 70px;
    }

    #title {
        z-index: 1;
        font-size: 24px; /* 减小标题字号 */
        margin: 5px 0; /* 调整标题的上下间距 */
        text-align: center; /* 标题居中 */
    }

    #navMenu {
        display: flex;
        flex-wrap: wrap; /* 允许菜单项换行 */
        gap: 10px; /* 增加菜单项的间距 */
        margin: 10px 0;
        justify-content: center; /* 水平居中 */
    }

    #navMenu li {
        display: inline-block; /* 保持菜单项水平排列 */
        text-align: center; /* 每项菜单居中 */
    }

    #navMenu a {
        font-size: 14px; /* 缩小字体 */
        padding: 8px 12px; /* 减小点击区域的内边距 */
    }

    #login {
        margin-top: 10px; /* 调整与其他元素的间距 */
        width: 100%; /* 登录按钮宽度适应 */
    }

    #login button {
        width: 100%; /* 按钮占满可用宽度 */
        padding: 10px; /* 调整按钮大小 */
    }
}

@media (max-width: 480px) {
    #logo img {
        width: 50px; /* 在更小屏幕下进一步缩小 Logo */
        height: 50px;
    }

    #title {
        font-size: 18px; /* 减小标题字体 */
    }

    #navMenu {
        gap: 5px; /* 缩小菜单项的间距 */
        margin-top: 10px;
        justify-content: center; /* 确保菜单项居中 */
    }

    #navMenu a {
        font-size: 12px; /* 进一步缩小字体 */
        padding: 6px 10px;
    }

    #login button {
        padding: 8px; /* 调整按钮的内边距 */
    }

    /* 为了防止过长的文本超出容器，给标题加一个换行 */
    #title {
        white-space: normal;
        word-wrap: break-word;
    }
}




</style>
