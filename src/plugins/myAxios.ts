import axios from "axios";
import { ref } from "vue";
import { useUserStore } from "../store";

const instance = axios.create({
    baseURL: "http://localhost:8089",
    timeout: 10000,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
    // proxy: {
    //     host:
    // },
})
export const loadingInstance = ref(false);
// 添加请求拦截器
instance.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    loadingInstance.value = true;
    return config;
}, function (error) {
    // 对请求错误做些什么
    loadingInstance.value = false;
    // @ts-ignore
    return Promise.reject(error);
});

// 添加响应拦截器
axios.interceptors.response.use(function (response) {
    // 2xx 范围内的状态码都会触发该函数。
    // 对响应数据做点什么
    loadingInstance.value = false;
    return response.data;
}, function (error) {
    // 超出 2xx 范围的状态码都会触发该函数。
    // 对响应错误做点什么
    loadingInstance.value = false;
    // @ts-ignore
    return Promise.reject(error);
});

export default instance;