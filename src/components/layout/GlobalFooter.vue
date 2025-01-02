<template>
    <div id="footer">
        <div class="footer-content">
            <!-- 网站介绍部分 -->
            <div class="footer-left">
                <h3>火灾新闻网</h3>
                <p>提供准确、及时的火灾信息，帮助社会防灾减灾。</p>
                <p>&copy; 2024 火灾新闻网. 版权所有</p>
            </div>

            <!-- 快速链接部分 -->
            <div class="footer-links">
                <h4>快速链接</h4>
                <ul>
                    <li><a href="#/">首页</a></li>
                    <li><a href="#/hotTopics">热点中心</a></li>
                    <li><a href="#/science">科普园地</a></li>
                    <li><a href="#">联系我们</a></li>
                </ul>
            </div>

            <!-- 联系方式部分 -->
            <div class="footer-contact">
                <h4>联系方式</h4>
                <p>邮箱: <a href="mailto:contact@firemanagement.com">contact@firemanagement.com</a></p>
                <p>电话: 123-456-7890</p>
            </div>

            <!-- 网站地图部分（替代了原“关注我们”） -->
            <div class="footer-sitemap">
                <h4>网站地图</h4>
                <ul>
                    <li ><router-link to="/">首页</router-link></li>
                    <li><router-link to="/hotTopics">热点中心</router-link></li>
                    <li @click="scrollToTop"><router-link to="/science">科普园地</router-link></li>
                    <li @click="scrollToTop"><router-link to="/about">关于我们</router-link></li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
const scrollToTop = () => {
    window.scrollTo({
        top: 0,
        behavior: "smooth", // 平滑滚动
    });
};
</script>

<style scoped>
#footer {
    width: 100%;
    background: linear-gradient(135deg, #343a40 0%, #495057 100%); /* 渐变背景 */
    color: white;
    padding: 0px 20px;
    font-size: 14px;
    box-sizing: border-box;
    text-align: left;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* 阴影效果 */
}

.footer-content {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    max-width: 1200px;
    margin: 0 auto;
}

.footer-left,
.footer-links,
.footer-contact,
.footer-sitemap {  /* 修改为 footer-sitemap */
    flex: 1;
    margin: 15px;
    min-width: 250px;
    padding: 15px;
}

.footer-left h3 {
    font-size: 26px;
    font-weight: bold;
    color: #f8f9fa;
    margin-bottom: 10px;
}

.footer-left p {
    color: #dcdcdc;
    font-size: 14px;
    line-height: 1.8;
}

.footer-links h4,
.footer-contact h4,
.footer-sitemap h4 {  /* 修改为 footer-sitemap h4 */
    font-size: 18px;
    color: #f8f9fa;
    margin-bottom: 15px;
    font-weight: 600;
}

.footer-links ul,
.footer-contact p,
.footer-sitemap ul {  /* 修改为 footer-sitemap ul */
    list-style: none;
    padding-left: 0;
}

.footer-links li,
.footer-sitemap li {  /* 修改为 footer-sitemap li */
    margin: 8px 0;
}

.footer-links a,
.footer-contact a,
.footer-sitemap a {  /* 修改为 footer-sitemap a */
    color: #dcdcdc;
    text-decoration: none;
    transition: color 0.3s ease;
}

.footer-links a:hover,
.footer-contact a:hover,
.footer-sitemap a:hover {  /* 修改为 footer-sitemap a:hover */
    color: #ffcc00; /* 悬停时改变为金色 */
}

.footer-social .social-icons {
    display: flex;
    gap: 20px;
}

.footer-social .social-icon {
    padding: 12px;
    background-color: #495057;
    color: white;
    border-radius: 50%;
    text-align: center;
    width: 50px;
    height: 50px;
    line-height: 50px;
    font-size: 18px;
    text-decoration: none;
    transition: background-color 0.3s, transform 0.3s;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2); /* 增加阴影效果 */
}

.footer-social .social-icon:hover {
    background-color: #007bff;
    transform: scale(1.1); /* 放大效果 */
}

@media screen and (max-width: 768px) {
    #footer {
        padding: 30px 10px;
    }

    .footer-content {
        flex-direction: column;
        align-items: center;
        text-align: center;
    }

    .footer-left,
    .footer-links,
    .footer-contact,
    .footer-sitemap {  /* 修改为 footer-sitemap */
        margin: 10px 0;
    }

    .footer-left h3 {
        font-size: 22px;
    }

    .footer-links h4,
    .footer-contact h4,
    .footer-sitemap h4 {  /* 修改为 footer-sitemap h4 */
        font-size: 16px;
    }

    .footer-links li,
    .footer-sitemap li {  /* 修改为 footer-sitemap li */
        margin: 5px 0;
    }

    .footer-social .social-icons {
        justify-content: center;
    }

    .footer-left p,
    .footer-links a,
    .footer-contact p,
    .footer-sitemap a {  /* 修改为 footer-sitemap a */
        font-size: 14px;
    }
}
</style>
