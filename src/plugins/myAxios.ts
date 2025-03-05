import axios from "axios";
import { ref } from "vue";
import { useUserStore } from "../store";

// 自定义错误类型
enum ApiErrorType {
    NetworkError,
    ServerError,
    ValidationError,
    // ... 其他错误类型
};

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
// instance.interceptors.response.use(function (response) {
//     // 2xx 范围内的状态码都会触发该函数。
//     // 对响应数据做点什么
//     loadingInstance.value = false;
//     return response.data;
// }, function (error) {
//     // 超出 2xx 范围的状态码都会触发该函数。
//     // 对响应错误做点什么
//     loadingInstance.value = false;
//     if (!error.response) {
//         // 网络错误或请求未发出（如后端未启动）
//         alert("网络异常，请检查您的网络连接或后端服务是否启动");
//     } else if (error.response.status === 500) {
//         // 后端服务内部错误（可根据实际情况调整）
//         alert("后端服务异常，请稍后重试");
//     } else {
//         // 其他类型的错误（可根据需要添加更多的错误处理逻辑）
//         alert("请求失败，请检查您的请求参数或网络状况");
//     }
//     return Promise.reject(error);
// });
// 响应拦截器
instance.interceptors.response.use(
    response => response,
    error => {
        // 根据错误状态码或错误信息判断错误类型
        let errorType: ApiErrorType;
        let errorMessage: string;

        if (!error.response) {
            errorType = ApiErrorType.NetworkError;
            errorMessage = "网络异常，请检查您的网络连接";
        } else if (error.response.status >= 500 && error.response.status < 600) {
            errorType = ApiErrorType.ServerError;
            errorMessage = "服务器内部错误，请稍后重试";
        } else if (error.response.status >= 400 && error.response.status < 500) {
            errorType = ApiErrorType.ValidationError;
            errorMessage = "请求验证失败，请检查您的输入";
            // ... 可以根据不同的4xx状态码进一步细分错误类型
        } else {
            errorType = ApiErrorType.NetworkError;
            errorMessage = "未知错误，请稍后重试";
        }

        // 给错误对象添加自定义属性
        error.type = errorType;
        error.message = errorMessage;

        // 显示用户友好提示（可以通过Vuex、Vue组件或其他方式实现）
        alert(errorMessage);

        // 错误上报（可以通过sentry、logrocket或其他监控平台实现）
        reportError(error);

        // 抛出错误，以便调用者可以进一步处理
        return Promise.reject(error);
    }
);
export function reportError(error: any) {
    // 假设您使用的是Sentry
    //Sentry.captureException(error);

    // 或者，如果您有自己的后端接口来接收错误报告
    // fetch('/api/report-error', {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify(error),
    // });
}
export default instance;