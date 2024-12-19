<template>
    <div id="indexHeader">
        <div id="upperLine"></div>
        <div id="logo">logo</div>
        <span id="title">火灾新闻网</span>
        <ul id="navMenu">
            <li><router-link to="/">首页</router-link></li>
            <li><router-link to="/hotTopics">热点要闻</router-link></li>
            <li><router-link to="/science">科普园地</router-link></li>
            <li><router-link to="/writer">作者页</router-link></li>
            <li><router-link to="/admin">管理员</router-link></li>
            <li><router-link to="/about">关于</router-link></li>
        </ul>
        <div id="login">
            <a-button @click="openLoginModal"><span>登录</span></a-button>
        </div>
        <login-modal :visible="isLoginModalVisible" @close="isLoginModalVisible = false"></login-modal>
    </div>
</template>

<script setup>
import { ref } from "vue";
import LoginModal from "@/components/modals/LoginModal.vue";

const isLoginModalVisible = ref(false);



const openLoginModal = () => {
    isLoginModalVisible.value = true;
    console.log(isLoginModalVisible.value);
};
</script>

<style scoped>
#indexHeader {
    width: 100%;
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
    color: #fff;
    font-size: 20px;
    margin-left: 6%;
    margin-right: 20px;
    text-transform: uppercase;
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
}a

#navMenu a:hover::after {
    width: 100%;
}
#login a-button {
    background-color: #ff5e3a;
    border: none;
    font-weight: bold;
    color: #fff;
    padding: 8px 16px;
    border-radius: 20px;
    transition: background-color 0.3s ease, box-shadow 0.3s ease;
}

#login a-button:hover {
    background-color: #ff7b54;
    box-shadow: 0 4px 8px rgba(255, 94, 58, 0.4);
}
</style>
