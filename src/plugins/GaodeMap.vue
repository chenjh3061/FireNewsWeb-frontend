<template>
    <div class="flx-align-center mb-10">
        <a-input
                v-model="address"
                class="address mr-20"
                id="address"
                placeholder="请输入地址"
        ></a-input>
        <a-button type="primary" @click="search">查询</a-button>
    </div>
    <div id="container"></div>
</template>

<script setup>
import {onMounted, onUnmounted, ref} from "vue";
import AMapLoader from "@amap/amap-jsapi-loader";

const address = ref("");
let map = null;

onMounted(() => {
    window._AMapSecurityConfig = {
        securityJsCode: "0f09299057858403ca371050ff96ed57",
    };
    AMapLoader.load({
        // 申请好的Web端开发者Key，首次调用 load 时必填
        key: "a4887a4b718a39aa7e85a964fe865f87",
        // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
        version: "2.0",
        //需要使用的的插件列表，如比例尺'AMap.Scale'，支持添加多个如：['...','...']
        plugins: [
            "AMap.ToolBar",
            "AMap.Scale",
            "AMap.PlaceSearch",
            "AMap.AutoComplete",
            "AMap.HawkEye",
            "AMap.Geolocation",
            "AMap.Geocoder",
            "AMap.MapType",
            "AMap.DistrictSearch",
            "AMap.LineSearch",
            "AMap.StationSearch",
            "AMap.Driving",
            "AMap.Walking",
            "AMap.Transfer",
            "AMap.DragRoute",
            "AMap.MouseTool",
            "AMap.PolylineEditor",
            "AMap.CloudDataSearch",
            "AMap.RangingTool",
            "AMap.Weather",
        ],
    })
        .then((AMap) => {
            map = new AMap.Map("container", {
                //设置地图容器id
                viewMode: "3D",
                //设置地图级别
                zoom: 10,
                //设置地图中心点
                center: [116.397428, 39.90923],
            });
            // 添加工具条
            map.plugin(["AMap.ToolBar"], function () {
                const tool = new AMap.ToolBar();
                map.addControl(tool);
            });
            map.plugin(["AMap.Scale"], function () {
                map.addControl(new AMap.Scale()); // 比例尺条控件
            });
            map.plugin(["AMap.Geolocation"], function () {
                map.addControl(new AMap.Geolocation()); //定位当前位置插件； 用来获取和展示用户主机所在的经纬度位置；
            });
            map.plugin(["AMap.HawkEye"], function () {
                map.addControl(new AMap.HawkEye()); //鹰眼插件；在地图右下角显示地图的缩略图
            });
            map.plugin(["AMap.MapType"], function () {
                map.addControl(new AMap.MapType()); //实现默认图层与卫星图、实施交通图层之间切换的控件
            });
            // 添加搜索控件
            map.plugin(["AMap.PlaceSearch"], function () {
                map.addControl(new AMap.PlaceSearch());
                var PlaceSearchOptions = {
                    city: "北京", //城市，默认全国
                    type: "",
                    pageSize: 10, //单页显示结果条数，默认10
                    pageIndex: 1, //页码，默认1
                    extensions: "base", //返回结果类型，base表示只返回基本信息，all表示返回所有信息
                };
                var MSearch = new AMap.PlaceSearch(PlaceSearchOptions); //构造PlaceSearch类
                // eslint-disable-next-line no-undef
                AMap.event.addListener(MSearch, "complete", keywordSearch_CallBack); //返回结果
                MSearch.search("方恒国际中心"); //关键字查询
            });
            // 灵活点标记
            var marker = new AMap.ElasticMarker();
            map.addControl(marker);
            // 添加地图操作控件
            var controlBar = new AMap.ControlBar({
                position: {
                    right: "10px",
                    top: "10px",
                },
            });
            map.addControl(controlBar);
            // 图层切换
            var mapType = new AMap.MapType();
            map.addControl(mapType);
            // 输入提示
            var auto = new AMap.AutoComplete();
            map.addControl(auto);
            // 行政区查询
            var districtSearch = new AMap.DistrictSearch();
            map.addControl(districtSearch);
            AMap.plugin(["AMap.DistrictSearch"], function () {
                var districtSearch = new AMap.DistrictSearch({
                    level: "country",
                    subdistrict: 1,
                }); //初始化行政区查询对象
                districtSearch.search("中国", function (status, result) {
                    console.log("111", result);
                });
            });
            // 公交查询
            var bus = new AMap.LineSearch();
            map.addControl(bus);
            var stationSearch = new AMap.StationSearch();
            map.addControl(stationSearch);
            // 驾车路线
            var driving = new AMap.Driving();
            map.addControl(driving);
            // 步行路线
            var walking = new AMap.Walking();
            map.addControl(walking);
            // 拖拽导航
            var dragRoute = new AMap.DragRoute();
            map.addControl(dragRoute);
            // 城市获取
            var citySearch = new AMap.CitySearch();
            map.addControl(citySearch);
            // 地理编码
            var geocoder = new AMap.Geocoder();
            map.addControl(geocoder);
            // 鼠标工具插件
            map.plugin(["AMap.MouseTool"], function () {
                var mouseTool = new AMap.MouseTool(map);
                mouseTool.rule();
            });
            //用户手动绘制折线图，测量距离
            // 轨迹编辑
            var lineEditor = new AMap.PolylineEditor();
            map.addControl(lineEditor);
            // 测距
            var ruler = new AMap.RangingTool();
            map.addControl(ruler);
            // 天气
            var weather = new AMap.Weather();
            map.addControl(weather);
            geocoder = new AMap.Geocoder({city: ""});
        })
        .catch((e) => {
            console.log(e);
        });
});

onUnmounted(() => {
    map?.destroy();
});
</script>

<style scoped>
#container {
    width: 80%;
    height: 800px;
}
</style>
