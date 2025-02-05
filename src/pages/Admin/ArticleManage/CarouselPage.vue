<template>
    <div class="carousel-news-management">
        <h2>新闻轮播管理</h2>

        <!-- 已选轮播新闻 -->
        <div class="selected-news">
            <h3>已选择的轮播新闻</h3>
            <a-table
                :loading="loading"
                :columns="columns"
                :data-source="selectedNews"
                :pagination="{ pageSize: 5 }"
                bordered
                rowKey="id"
            >
                <template #bodyCell="{ column, record }">
                    <template v-if="column.dataIndex === 'createTime'">
                        {{ dayjs(record.createTime).format("YYYY-MM-DD HH:mm") }}
                    </template>
                    <template v-else-if="column.dataIndex === 'isCarousel'">
                        <a-tag v-bind="mappings[column.dataIndex](record)">
                            {{ mappings[column.dataIndex](record).text }}
                        </a-tag>
                    </template>
                    <template v-else-if="column.dataIndex === 'action'">
                        <a-popconfirm
                            title="确定要移除该轮播文章吗？"
                            okText="确定"
                            cancelText="取消"
                            @confirm="removeFromCarousel(record)"
                            @cancel="cancel">
                            <a-button
                                danger
                                type="primary"
                            >
                                移除
                            </a-button>
                        </a-popconfirm>

                    </template>
                </template>
            </a-table>
        </div>

        <!-- 可选新闻 -->
        <div class="news-list">
            <h3>可添加到轮播的新闻</h3>
            <a-input-search class="search-input" v-model:value="searchParams"
                            placeholder="搜索新闻" @search="onSearch" />
            <a-button type="primary" @click="cancelSearch">清空搜索</a-button>
            <a-table
                    :columns="columns"
                    :data-source="carouselList"
                    :pagination="pagination"
                    bordered
                    rowKey="id"
            >
                <template #bodyCell="{ column, record }">
                    <template v-if="column.dataIndex === 'createTime'">
                        {{ dayjs(record.createTime).format("YYYY-MM-DD HH:mm") }}
                    </template>
                    <template v-else-if="column.dataIndex === 'isCarousel'">
                        <a-tag v-bind="mappings[column.dataIndex](record)">
                            {{ mappings[column.dataIndex](record).text }}
                        </a-tag>
                    </template>
                    <template v-if="column.dataIndex === 'action'">
                        <a-button type="default" @click="previewNews(record)">
                            预览文章
                        </a-button>
                        <a-popconfirm
                            title="确定要添加到轮播吗？"
                            okText="确定"
                            cancelText="取消"
                            @confirm="addToCarousel(record)"
                            @cancel="cancel"
                        >
                            <a-button
                                    :disabled="selectedNews.length >= 5 || isAlreadyInCarousel(record.id)"
                                    type="primary"
                            >
                                添加到轮播
                            </a-button>
                        </a-popconfirm>

                    </template>
                </template>
            </a-table>
        </div>
        <ArticleModal
                v-model:visible="isDetailVisible"
                :article="selectedArticle"
        />
    </div>
</template>


<script lang="ts" setup>
import {ref} from "vue";
import {message, TableColumnsType} from "ant-design-vue";
import myAxios from "../../../plugins/myAxios";
import dayjs from "dayjs";
import {fieldMappings} from "../../../utils/mapping.js";
import ArticleModal from "../../../components/modals/ArticleDetailModal.vue";
import {computed} from "vue";

const mappings = fieldMappings;

const loading = ref(false);

const columns = ref<TableColumnsType>([
    {title: "文章标题", dataIndex: "articleTitle", key: "articleTitle"},
    {title: "提交时间", dataIndex: "createTime", key: "createTime",
        sorter: (a, b) => {
            const dateA = new Date(a.createTime).getTime();  // 转换为时间戳
            const dateB = new Date(b.createTime).getTime();
            return dateA - dateB;  // 比较时间戳，升序排列
        },
        sortDirections: ['descend', 'ascend'],},
    {title: "状态", dataIndex: "isCarousel", key: "isCarousel"},
    {title: "操作", key: "action", dataIndex: "action"},
]);

const pagination = computed(() => {
    return {
        current: 1,
        pageSize: 10,
        total: carouselList.value.length,
        showTotal: (total) => '共'+total+'条记录',
        showSizeChanger: true,
        onChange: (page: number, pageSize: number) => {
            pagination.value.current = page;
            pagination.value.pageSize = pageSize;
        },
    }
});

const selectedNews = ref([]);
const carouselList = ref([]);

const isDetailVisible = ref(false);
const selectedArticle = ref(null);
const previewNews = (record: any) => {
    selectedArticle.value = record; // 设置当前文章
    console.log(selectedArticle.value);
    isDetailVisible.value = true; // 打开弹窗
};

const searchList = ref([]);
const searchParams = ref();
// 搜索新闻
const onSearch = () => {
    if (!searchParams.value) return;
    console.log(searchParams.value);
    searchList.value = carouselList.value;
    carouselList.value = carouselList.value.filter((item) =>
        item.articleTitle.includes(searchParams.value)
    );
};

const cancelSearch = (value) => {
    searchParams.value = "";
    carouselList.value = searchList.value;
};

// 判断新闻是否已经在轮播中
const isAlreadyInCarousel = (id) => {
    return selectedNews.value.some((item) => item.articleId === id);
}


// 获取已选轮播新闻
const getCarouselNews = async () => {
    try {
        const res = await myAxios.get("/article/getCarouselArticles");
        if (res.data.code === 0) {
            selectedNews.value = res.data.data;
        } else {
            message.error("获取轮播新闻失败！");
        }
    } catch (error) {
        message.error("获取轮播新闻失败！");
    }
};

// 获取可添加新闻列表
const getCarouselList = async () => {
    loading.value = true;
    try {
        const res = await myAxios.get("/article/getAllArticles");
        if (res.data.code === 0) {
            carouselList.value = res.data.data.filter(
                (item) => item.isCarousel === 0
            );
            searchList.value = carouselList.value;
        } else {
            message.error("获取新闻列表失败！");
        }
    } catch (error) {
        message.error("获取新闻列表失败！");
    } finally {
        loading.value = false;
    }
};

// 添加到轮播新闻
const addToCarousel = async (item) => {
    try {
        const res = await myAxios.post("/article/setCarouselArticles", null,
            {
                params: {
                    id: item.articleId,
                },
            }
        );
        if (res.data.code === 0) {
            message.success("新闻已添加到轮播！");
            await getCarouselNews();
            await getCarouselList();
        } else {
            message.error("添加失败，请重试！");
        }
    } catch (error) {
        message.error("添加失败，请重试！");
    }
};

// 从轮播新闻移除
const removeFromCarousel = async (item) => {
    console.log(item);
    try {
        const res = await myAxios.post("/article/cancelCarouselArticles", null,
            {
                params: {
                    id: item.id,
                },
            }
        );
        if (res.data.code === 0) {
            message.success("新闻已从轮播中移除！");
            await getCarouselNews();
            await getCarouselList();
        } else {
            message.error("移除失败，请重试！");
        }
    } catch (error) {
        message.error("移除失败，请重试！");
    }
};

const cancel = (e: MouseEvent) => {
    console.log(e);
    message.error('Click on No');
};

// 初始化数据
getCarouselNews();
getCarouselList();
</script>


<style scoped>
.carousel-news-management {
    max-width: 900px;
    margin: 20px auto;
    background-color: #fff;
    padding: 20px;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

h2 {
    text-align: center;
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 20px;
}

h3 {
    font-size: 18px;
    font-weight: bold;
    color: #333;
    margin-bottom: 12px;
}

.news-list,
.selected-news {
    margin-bottom: 40px;
}

.news-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px;
    background: #f9f9f9;
    border-radius: 8px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
    transition: background 0.3s;
}

.news-item:hover {
    background: #f1f1f1;
}

.search-input {
    width: 80%;
}

a-button {
    color: #0078d4;
    font-size: 14px;
    transition: color 0.3s;
}

a-button:hover {
    color: #005a99;
}

.remove-button,
.add-button {
    font-size: 14px;
    background: #ff4d4f;
    color: #fff;
    border-radius: 6px;
    padding: 6px 12px;
    transition: background 0.3s, transform 0.3s;
}

.remove-button:hover,
.add-button:hover {
    background: #d9363e;
    transform: translateY(-2px);
}

/* 针对表格的整体外观 */
.a-table {
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.a-table th {
    background: #f7f7f7;
    color: #333;
}

.a-table td {
    font-size: 14px;
    color: #555;
}
</style>
