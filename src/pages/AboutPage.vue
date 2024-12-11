<template>
    <div class="about-page">
        <!-- 标题部分 -->
        <div class="about-header">
            <h1>关于</h1>
            <p>提供最及时、准确的火灾新闻信息，助力社会的安全与发展</p>
        </div>

        <!-- 平台介绍 -->
        <div class="about-section">
            <h2>平台介绍</h2>
            <p>
                本平台致力于提供火灾新闻信息的实时报道，平台汇集了全国范围内的火灾新闻和安全知识，旨在为公众提供快速准确的火灾相关信息，提高社会公众的防火意识，确保每个人的生命安全。
            </p>
        </div>

        <!-- 我们的使命 -->
        <div class="about-section">
            <h2>我们的使命</h2>
            <p>
                实时报道火灾新闻、传播火灾防控知识，减少火灾带来的生命财产损失。我们承诺为用户提供准确、及时、权威的火灾相关信息。
            </p>
        </div>

        <!-- 团队介绍 -->
        <div class="about-section team">
            <h2>技术支持</h2>
            <div class="team-members">
                <div class="team-member">
                    <img src="https://via.placeholder.com/150" alt="Team Member" />
                    <p class="name">XX电视台</p>
                    <p class="role">权威新闻报道</p>
                </div>
                <div class="team-member">
                    <img src="https://via.placeholder.com/150" alt="Team Member" />
                    <p class="name">XX救援队</p>
                    <p class="role">消防专业知识</p>
                </div>
                <div class="team-member">
                    <img src="https://via.placeholder.com/150" alt="Team Member" />
                    <p class="name">火灾新闻网团队</p>
                    <p class="role">网络技术支持</p>
                </div>
            </div>
        </div>

        <!-- 联系我们 -->
        <div class="about-section">
            <h2>联系我们</h2>
            <p>
                有任何问题或建议，欢迎通过以下方式与我们联系：
            </p>
            <ul>
                <li>Email: support@firenews.com</li>
                <li>电话: 123-456-7890</li>
                <li>地址: XX市YY区ZZ大厦</li>
            </ul>
        </div>

        <!-- 版权信息 -->
        <div class="footer">
            <p>© 2024 火灾信息管理平台. All rights reserved.</p>
        </div>
    </div>
</template>

<script setup lang="ts">

</script>

<style scoped>
.about-page {
    font-family: 'Arial', sans-serif;
    padding: 20px;
    background-color: #f4f4f4;
    color: #333;
}

.about-header {
    text-align: center;
    margin-bottom: 30px;
}

.about-header h1 {
    font-size: 36px;
    color: #d9534f; /* 火灾相关的红色 */
}

.about-header p {
    font-size: 18px;
    color: #777;
}

.about-section {
    margin-bottom: 40px;
}

.about-section h2 {
    font-size: 28px;
    color: #d9534f;
    border-bottom: 2px solid #d9534f;
    padding-bottom: 10px;
    margin-bottom: 20px;
}

.about-section p {
    font-size: 16px;
    line-height: 1.6;
    color: #555;
}

.team-members {
    padding: 0 50px;
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
}

.team-member {
    text-align: center;
}

.team-member img {
    width: 150px;
    height: 150px;
    border-radius: 50%;
    margin-bottom: 10px;
}

.team-member .name {
    font-weight: bold;
    font-size: 16px;
    color: #333;
}

.team-member .role {
    font-size: 14px;
    color: #777;
}

.about-section ul {
    list-style: none;
    padding: 0;
}

.about-section ul li {
    font-size: 16px;
    line-height: 1.8;
}

.footer {
    text-align: center;
    margin-top: 40px;
    padding-top: 20px;
    border-top: 1px solid #ccc;
    font-size: 14px;
    color: #777;
}
</style>
