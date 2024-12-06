<template>
    <div class="dashboard">
        <h2 class="title">系统首页</h2>

        <!-- 卡片展示区 -->
        <div class="stat-cards">
            <a-row gutter={16}>
                <a-col span={6}>
                    <a-card :bordered="false" class="stat-card">
                        <div class="card-header">总访问量</div>
                        <div class="card-value">1,200</div>
                    </a-card>
                </a-col>
                <a-col span={6}>
                    <a-card :bordered="false" class="stat-card">
                        <div class="card-header">注册用户</div>
                        <div class="card-value">1,500</div>
                    </a-card>
                </a-col>
                <a-col span={6}>
                    <a-card :bordered="false" class="stat-card">
                        <div class="card-header">今日新增</div>
                        <div class="card-value">50</div>
                    </a-card>
                </a-col>
                <a-col span={6}>
                    <a-card :bordered="false" class="stat-card">
                        <div class="card-header">新闻发布</div>
                        <div class="card-value">300</div>
                    </a-card>
                </a-col>
            </a-row>
        </div>

        <!-- ECharts 图表展示 -->
        <div class="charts">
            <a-row gutter={16}>
                <a-col span={12}>
                    <a-card title="日访问量统计" :bordered="false">
                        <div ref="lineChart" style="height: 300px;"></div>
                    </a-card>
                </a-col>
                <a-col span={12}>
                    <a-card title="新闻发布趋势" :bordered="false">
                        <div ref="barChart" style="height: 300px;"></div>
                    </a-card>
                </a-col>
            </a-row>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import * as echarts from 'echarts';
import { Row, Col, Card } from 'ant-design-vue';

const lineChart = ref<HTMLDivElement | null>(null);
const barChart = ref<HTMLDivElement | null>(null);

// 组件挂载后初始化图表
onMounted(() => {
    if (lineChart.value) {
        const lineChartInstance = echarts.init(lineChart.value);
        lineChartInstance.setOption({
            title: {
                text: '日访问量统计',
                left: 'center',
            },
            xAxis: {
                type: 'category',
                data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
            },
            yAxis: {
                type: 'value',
            },
            series: [
                {
                    data: [120, 200, 150, 80, 70, 110, 130],
                    type: 'line',
                },
            ],
        });
    }

    if (barChart.value) {
        const barChartInstance = echarts.init(barChart.value);
        barChartInstance.setOption({
            title: {
                text: '新闻发布趋势',
                left: 'center',
            },
            xAxis: {
                type: 'category',
                data: ['一月', '二月', '三月', '四月', '五月', '六月'],
            },
            yAxis: {
                type: 'value',
            },
            series: [
                {
                    data: [400, 600, 800, 300, 400, 600],
                    type: 'bar',
                },
            ],
        });
    }
});
</script>

<style scoped>
.dashboard {
    max-width: 1200px;
    margin: 20px auto;
    background: #fff;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.title {
    text-align: center;
    margin-bottom: 20px;
    font-size: 24px;
}

.stat-cards {
    margin-bottom: 40px;
}

.stat-card {
    background: #f0f2f5;
    text-align: center;
    padding: 16px;
    border-radius: 8px;
}

.card-header {
    font-size: 18px;
    margin-bottom: 8px;
    color: #333;
}

.card-value {
    font-size: 24px;
    font-weight: bold;
    color: #0078d4;
}

.charts {
    margin-top: 40px;
    width: 100%;
}
</style>
