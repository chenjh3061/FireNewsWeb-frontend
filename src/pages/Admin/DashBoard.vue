<template>
    <div class="dashboard">
        <!-- 顶部欢迎信息 -->
        <div class="welcome-section">
            <div class="welcome-content">
                <h1>欢迎回来，管理员！</h1>
                <p>今天是个好日子，祝您工作顺利！</p>
            </div>
            <img
                src="https://source.unsplash.com/160x160/?business"
                alt="welcome-image"
                class="welcome-image"
            />
        </div>

        <!-- 数据统计卡片 -->
        <div class="stats-section">
            <div class="stat-card">
                <div class="card-icon">📈</div>
                <div class="card-info">
                    <p class="card-title">今日访问量</p>
                    <h2>12,345</h2>
                </div>
            </div>
            <div class="stat-card">
                <div class="card-icon">📊</div>
                <div class="card-info">
                    <p class="card-title">活跃用户</p>
                    <h2>2,560</h2>
                </div>
            </div>
            <div class="stat-card">
                <div class="card-icon">📰</div>
                <div class="card-info">
                    <p class="card-title">发布新闻</p>
                    <h2>321</h2>
                </div>
            </div>
            <div class="stat-card">
                <div class="card-icon">⚙️</div>
                <div class="card-info">
                    <p class="card-title">系统运行时间</p>
                    <h2>102 天</h2>
                </div>
            </div>
        </div>

        <!-- 图表与动态 -->
        <div class="main-section">
            <!-- 折线图 -->
            <div class="chart-section">
                <h3>近7天访问量趋势</h3>
                <div ref="lineChart"></div>
            </div>
            <!-- 动态信息 -->
            <div class="activity-section">
                <h3>最近动态</h3>
                <ul class="activity-list">
                    <li>
                        <p>新增用户：张三</p>
                        <span>1小时前</span>
                    </li>
                    <li>
                        <p>新闻发布：火灾最新动态</p>
                        <span>2小时前</span>
                    </li>
                    <li>
                        <p>系统更新：版本 1.0.3 发布</p>
                        <span>3小时前</span>
                    </li>
                    <li>
                        <p>管理员登录：李四</p>
                        <span>5小时前</span>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import * as echarts from 'echarts';

// ECharts图表初始化
const lineChart = ref<HTMLDivElement | null>(null);

onMounted(() => {
    if (lineChart.value) {
        const lineChartInstance = echarts.init(lineChart.value);
        lineChartInstance.setOption({
            title: {
                text: '访问量与新闻发布趋势',
                left: 'center',
                top: '10px',
            },
            tooltip: {
                trigger: 'axis',
            },
            legend: {
                data: ['日访问量', '新闻发布量'],
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
                    name: '日访问量',
                    type: 'line',
                    data: [120, 200, 150, 80, 70, 110, 130],
                    smooth: true,
                    color: '#0078d4',
                },
                {
                    name: '新闻发布量',
                    type: 'bar',
                    data: [60, 80, 70, 50, 60, 75, 90],
                    color: '#ff7f50',
                },
            ],
        });
    }
});
</script>

<style scoped>
/* 整体布局 */
.dashboard {
    margin: 0 auto;
    background: #f8f9fa;
    border-radius: 12px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    display: grid;
    grid-gap: 20px;
}

/* 欢迎部分 */
.welcome-section {
    background: linear-gradient(135deg, #4e73df, #224abe);
    border-radius: 16px;
    padding: 30px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: #fff;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
}

.welcome-content h1 {
    margin: 0;
    font-size: 1.5rem;
    font-weight: bold;
}

.welcome-content p {
    margin-top: 10px;
    font-size: 1rem;
    opacity: 0.9;
}

.welcome-image {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    border: 4px solid rgba(255, 255, 255, 0.8);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

/* 数据统计卡片 */
.stats-section {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    grid-gap: 10vw;
}

.stat-card {
    background: #fff;
    border-radius: 12px;
    padding: 20px;
    text-align: center;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s, box-shadow 0.3s;
}

.stat-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.card-icon {
    font-size: 2rem;
    margin-bottom: 10px;
}

.card-title {
    font-size: 1rem;
    color: #888;
}

.card-info h2 {
    font-size: 1.5rem;
    font-weight: bold;
    color: #333;
}

/* 主体部分 */
.main-section {
    min-height: 400px;
    display: grid;
    grid-template-columns: 2fr 1fr;
    grid-gap: 20px;
}

.chart-section {
    background: #fff;
    border-radius: 12px;
    padding: 20px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    /* 设置图表容器的最大宽度和高度 */
    width: 100%;
    max-width: 100%;
    height: auto;
    min-height: 300px; /* 确保图表有足够的显示空间 */
}

.chart-section h3 {
    margin-bottom: 20px;
    font-size: 1.2rem;
    font-weight: bold;
    color: #333;
}

.activity-section {
    background: #fff;
    border-radius: 12px;
    padding: 20px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.activity-section h3 {
    margin-bottom: 20px;
    font-size: 1.2rem;
    font-weight: bold;
    color: #333;
}

.activity-list li {
    display: flex;
    justify-content: space-between;
    padding: 10px 0;
    border-bottom: 1px solid #f0f0f0;
    font-size: 1rem;
    color: #555;
}

.activity-list li:last-child {
    border-bottom: none;
}

.activity-list span {
    color: #888;
    font-size: 0.875rem;
}

/* 媒体查询优化 */
@media (max-width: 1130px) {
    .dashboard {
        padding: 10px;
    }

    .welcome-section {
        flex-direction: column;
        align-items: center;
        text-align: center;
    }

    .stats-section {
        grid-template-columns: 1fr 1fr;
    }

    .main-section {
        grid-template-columns: 1fr;
    }

    .chart-section, .activity-section {
        padding: 15px;
    }

    .card-icon {
        font-size: 2rem;
    }

    .card-info h2 {
        font-size: 1.2rem;
    }

    .activity-list li {
        font-size: 0.875rem;
    }
}

/* 移动端优化 */
@media (max-width: 866px) {
    .welcome-section {
        padding: 20px;
        flex-direction: column;
        text-align: center;
    }

    .welcome-image {
        width: 90px;
        height: 90px;
        margin-top: 20px;
    }

    .welcome-content h1 {
        font-size: 1.5rem;
    }

    .welcome-content p {
        font-size: 1rem;
    }

    .stats-section {
        grid-template-columns: 1fr; /* 让卡片垂直排列 */
        grid-gap: 20px;
    }

    .stat-card {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 15px;
        text-align: center;
    }

    .card-icon {
        font-size: 1.5rem;
    }

    .card-info h2 {
        font-size: 1.2rem;
    }

    .activity-section {
        margin-top: 20px;
    }

    .activity-list li {
        font-size: 0.875rem;
        padding: 8px 0;
    }

    .chart-section {
        padding: 15px;
    }
}

/* 小屏手机优化 */
@media (max-width: 480px) {
    .dashboard {
        padding: 10px;
    }

    .welcome-section {
        padding: 15px;
        text-align: center;
    }

    .welcome-image {
        width: 70px;
        height: 70px;
    }

    .welcome-content h1 {
        font-size: 1.25rem;
    }

    .card-title, .card-info h2 {
        font-size: 1rem;
    }

    .activity-section {
        padding: 10px;
    }

    .activity-list li {
        font-size: 0.75rem;
    }

    .stat-card {
        margin-bottom: 15px;
    }

    .chart-section {
        padding: 10px;
    }
}

</style>
