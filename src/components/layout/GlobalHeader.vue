<template>
    <div id="indexHeader">
        <div id="upperLine"></div>
        <div id="logo">
            <img src="../../assets/Logo.png" alt="logo">
        </div>
        <span id="title">火灾新闻网</span>
        <ul id="navMenu" >
            <li v-for="item in menuRoutes">
                <router-link :to="item.path" active-class="active">{{ item.meta.title }}</router-link>
            </li>
<!--            <li><router-link to="/hotTopics" active-class="active">热点要闻</router-link></li>-->
<!--            <li><router-link to="/science" active-class="active">科普园地</router-link></li>-->
<!--            <li><router-link to="/writer" active-class="active">作者页</router-link></li>-->
<!--            <li><router-link to="/admin" active-class="active">管理员</router-link></li>-->
<!--            <li><router-link to="/about" active-class="active">关于</router-link></li>-->
        </ul>
        <div id="login">
            <button @click="openLoginModal"><span>登录</span></button>
        </div>
        <login-modal :visible="isLoginModalVisible" @close="isLoginModalVisible = false"></login-modal>
    </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import LoginModal from "@/components/modals/LoginModal.vue";

const isLoginModalVisible = ref(false);

const router = useRouter();

// 过滤需要的导航路由（只显示一级路由，并且包含 meta.title）
const menuRoutes = router.options.routes.filter(route => route.meta && route.meta.title);

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

@media (max-width: 768px) {
    #logo img {
        width: 70px;
        height: 70px;
    }
}

@media (max-width: 480px) {
    #logo img {
        width: 50px;
        height: 50px;
    }
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

</style>
