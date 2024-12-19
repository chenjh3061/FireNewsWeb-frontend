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

            <!-- 社交媒体部分 -->
            <div class="footer-social">
                <h4>关注我们</h4>
                <div class="social-icons">
                    <a href="#" class="social-icon">FB</a>
                    <a href="#" class="social-icon">TW</a>
                    <a href="#" class="social-icon">IN</a>
                    <a href="#" class="social-icon">YT</a>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
#footer {
    width: 100%;
    max-height: 15vh;
    background-color: #343a40; /* 深色背景 */
    color: white;
    padding: 0 20px;
    font-size: 14px;
    box-sizing: border-box;
    text-align: left;
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
.footer-social {
    flex: 1;
    margin: 10px;
    min-width: 200px;
}

.footer-left h3 {
    font-size: 22px;
    margin: 0;
    font-weight: bold;
    color: #f8f9fa;
}

.footer-left p {
    color: #dcdcdc;
    font-size: 14px;
}

.footer-links h4,
.footer-contact h4,
.footer-social h4 {
    font-size: 18px;
    color: #f8f9fa;
    margin-bottom: 10px;
}

.footer-links ul,
.footer-contact p {
    list-style: none;
    padding-left: 0;
}

.footer-links li {
    margin: 8px 0;
}

.footer-links a,
.footer-contact a {
    color: #dcdcdc;
    text-decoration: none;
}

.footer-links a:hover,
.footer-contact a:hover {
    color: #f8f9fa;
}

.footer-social .social-icons {
    display: flex;
    gap: 15px;
}

.footer-social .social-icon {
    padding: 10px 15px;
    background-color: #495057;
    color: white;
    border-radius: 50%;
    text-align: center;
    width: 40px;
    height: 40px;
    line-height: 40px;
    font-size: 16px;
    text-decoration: none;
}

.footer-social .social-icon:hover {
    background-color: #007bff;
}

@media screen and (max-width: 768px) {
    .footer-content {
        flex-direction: column;
        text-align: center;
    }

    .footer-left,
    .footer-links,
    .footer-contact,
    .footer-social {
        flex: none;
        margin: 10px 0;
    }

    .footer-social .social-icons {
        justify-content: center;
    }
}
</style>
