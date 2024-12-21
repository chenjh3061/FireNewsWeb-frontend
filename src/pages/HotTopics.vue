<template>
    <a-layout class="hotTopicLayout">
        <a-layout-content class="hotTopicContent">
            <a-list :data-source="listData" :pagination="pagination" item-layout="vertical" size="large">
                <template #footer>
                    <div>
                        <b>ant design vue</b>
                        footer part
                    </div>
                </template>
                <template #renderItem="{ item }">
                    <a-list-item key="item.title">
                        <template #actions>
          <span v-for="{ icon, text } in actions" :key="icon">
            <component :is="icon" style="margin-right: 8px"/>
            {{ text }}
          </span>
                        </template>
                        <template #extra>
                            <img
                                    alt="logo"
                                    src="https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png"
                                    width="272"
                            />
                        </template>
                        <a-list-item-meta :description="item.description">
                            <template #title>
                                <a :href="item.href">{{ item.title }}</a>
                            </template>
                            <template #avatar>
                                <a-avatar :src="item.avatar"/>
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
import {LikeOutlined, MessageOutlined, StarOutlined} from '@ant-design/icons-vue';
import myAxios from "../plugins/myAxios";

const listData: Record<string, string>[] = [];

for (let i = 0; i < 23; i++) {
    listData.push({
        href: 'https://www.antdv.com/',
        title: `ant design vue part ${i}`,
        avatar: 'https://joeschmoe.io/api/v1/random',
        description:
            'Ant Design, a design language for background applications, is refined by Ant UED Team.',
        content:
            'We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure), to help people create their product prototypes beautifully and efficiently.',
    });
}

const getHotTopics = () => {
    myAxios.get("/article/getHotArticles").then((res: any) => {
        res.data.data.reduce((a, b) => a.concat(b), []).forEach((item) => {
            listData.push({
                href: '',
                title: item.articleTitle,
                avatar: 'https://joeschmoe.io/api/v1/random',
                description: "Ant Design, a design language for background applications",
                content: item.articleContent,
            });
        });
    });
}

const pagination = {
    onChange: (page: number) => {
        console.log(page);
    },
    pageSize: 3,
};
const actions: Record<string, any>[] = [
    {icon: StarOutlined, text: '156'},
    {icon: LikeOutlined, text: '156'},
    {icon: MessageOutlined, text: '2'},
];
getHotTopics();
</script>

<style scoped>
.hotTopicLayout {
    min-height: 60%;
    width: 85%;
    background: #fff;
    padding: 32px;
    margin: 0 auto; /* 父级容器水平居中 */
    display: flex;
    justify-content: center; /* 子内容水平居中 */
    align-items: center; /* 子内容垂直居中 */
}

.hotTopicContent {
    width: 100%; /* 固定宽度 */
    background: #f5f5f5;
    display: flex;
    margin: 0 calc((100% - 80%) / 2); /* 使用 CSS calc 计算水平居中 */
    padding: 16px;
}

</style>

