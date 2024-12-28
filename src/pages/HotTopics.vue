<template>
    <a-layout class="hotTopicLayout">
        <h1 class="hot-title">热点新闻榜</h1>
        <a-layout-content class="hotTopicContent">
            <a-list :data-source="listData" :pagination="pagination" item-layout="vertical" size="large"
                    :style="{ width: '100%' }">
                <template #footer>
                    <div>
                        <b>组件支持来自ant design vue</b>
                    </div>
                </template>
                <template #renderItem="{ item }">
                    <a-list-item :key="item.articleId">
                        <template #actions>
                            <span v-for="(action, index) in actions" :key="index">
                                <component :is="action.icon" style="margin-right: 8px" />
                                {{ action.text }}
                            </span>
                        </template>
                        <template #extra>
                            <img
                                    alt="logo"
                                    :src="item.articleAvatar"
                                    :style="{width:'200px', margin:'0 0 16px auto'}"
                            />
                        </template>
                        <a-list-item-meta :description="item.articleDesc">
                            <template #title>
                                <a @click.prevent="viewNewsDetail(item)">{{ item.articleTitle }}</a>
                            </template>
                            <template #avatar>
                                <a-avatar :src="item.avatar" />
                                <span :style="{display: 'block'}">{{ item.authorName }}</span>
                            </template>
                        </a-list-item-meta>
                        {{ item.content }}
                    </a-list-item>
                </template>
            </a-list>
        </a-layout-content>
    </a-layout>
</template>

<script lang="ts" setup>
import { LikeOutlined, MessageOutlined, StarOutlined } from '@ant-design/icons-vue';
import { ref, onMounted } from 'vue';
import myAxios from "../plugins/myAxios";
import {useArticleStore} from "../store/index";
import router from "../router/index";

// 使用 ref 包装 listData
const listData = ref<any[]>([]);

// 获取热点新闻
const getHotTopics = async () => {
    try {
        const res = await myAxios.get("/article/getHotNews");
        if (res.data.code === 0) {
            listData.value = res.data.data; // 更新响应式数据
            console.log(listData.value);
        } else {
            console.error("获取热点新闻失败");
        }
    } catch (e) {
        console.error(e);
    }
};

// 分页设置
const pagination = {
    onChange: (page: number) => {
        console.log(page);
    },
    pageSize: 10,
};
const viewNewsDetail = ( newsData) => {
    useArticleStore().setSelectedArticle(newsData);
    router.push({
        path: '/article',
        params: { id: newsData.articleId },
    });
};
// 设置动作图标
const actions = [
    { icon: LikeOutlined, text: '156' },
    { icon: MessageOutlined, text: '2' },
];
getHotTopics();
// 页面加载时获取热点新闻
onMounted(() => {

});
</script>

<style scoped>
.hotTopicLayout {
    min-height: 60%;
    width: 85%;
    background: #fff;
    padding: 22px;
    margin: 0 auto;
    align-items: center;
}

.hot-title {
    width: 90%;
    display: flex;
    justify-content: left;
    font-size: 24px;
    color: #333;
    margin-bottom: 20px;
}

.hotTopicContent {
    width: 100%;
    background: #f5f5f5;
    display: flex;
    margin: 0 calc((100% - 80%) / 2);
    padding: 16px;
}
</style>
