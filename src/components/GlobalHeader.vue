<template>
    <div id="indexHeader">
        <div id="upperLine"></div>
        <div id="logo">logo</div>
        <span id="title">火灾新闻网</span>
        <ul id="navMenu">
            <li><a href="#/">首页</a></li>
            <li><a href="#/hotTopics">热点要闻</a></li>
            <li><a href="#/science">科普园地</a></li>
        </ul>
        <div id="login">
            <a-button><span>登录</span></a-button>
        </div>
    </div>
</template>

<script setup>

</script>

<style scoped>
#indexHeader {
    width: 100%;
    height: 100px;
    display: flex;
    align-items: center;
    background-color: #3c288c;
    padding: 0 20px;
    box-sizing: border-box;
}
#upperLine {
    width: 85%;
    height: 3.5%;
    top: 0;
    display: block;
    position: absolute;
    margin: 0 5%;
    background-color: #ff5e3a;
    transform: perspective(.8em) rotateX(-1deg);
}
#logo {
    color: #fff;
    font-size: 20px;
    margin-right: 20px;
}

#title {
    color: #fff;
    font-size: 30px;
    margin-right: auto; /* 将标题推到中间 */
}

#navMenu {
    list-style: none;
    display: flex;
    gap: 20px; /* 菜单项间距 */
    margin: 1% 10% 0 0;
    padding: 0;
}

#navMenu li {
    display: inline;
}

#navMenu a {
    color: #fff;
    text-decoration: none; /* 去掉下划线 */
    font-size: 16px;
    padding: 5px 10px; /* 增加点击区域 */
    transition: background-color 0.3s ease; /* 增加悬浮过渡效果 */
}

#navMenu a:hover {
    background-color: #5a47b5; /* 鼠标悬浮背景色 */
    border-radius: 4px; /* 圆角效果 */
}
</style>
