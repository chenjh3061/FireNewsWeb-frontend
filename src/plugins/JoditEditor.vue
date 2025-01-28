<template>
    <textarea id="editorRef" ref="editorRef" name="editor"></textarea>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from "vue";

import 'jodit/es2021/jodit.min.css';
import { Jodit } from "jodit";
import axios from "axios";
import {useUserStore} from "../store/index";
import {message} from "ant-design-vue";
import myAxios from "../plugins/myAxios";

let editorRef = ref(null);
const props = defineProps({
    modelValue: String,
    config: { type: Object, default: () => ({}) },
});
const emit = defineEmits(["update:modelValue"]);

let editorInstance; //创建示例

let config = {
    theme: "default", //主题：默认default，暗色dark
    placeholder: "请输入内容...",
    zIndex: 10,
    language: "zh_cn",
    width: "100%",
    height: "100%",
    minHeight: 400,
    saveModeInCookie: true,
    toolbarSticky: false, //工具栏设置sticky
    statusbar: false, //底部状态栏(左：html元素；右：单词数，字符数统计)
    image: {
        //图片相关配置
        editSrc: true,
        editStyle: true,
        useImageEditor: true,
    },
    link: {
        noFollowCheckbox: false,
        modeClassName: "",
    },
    i18n: {
        zh_cn: {
            top: "上",
            right: "右",
            bottom: "下",
            left: "左",
            Title: "标题",
            Link: "链接",
            "Line height": "行高",
            Alternative: "描述",
            "Alternative text": "描述",
            "Lower Alpha": "小写英文字母",
            "Lower Greek": "小写希腊字母",
            "Lower Roman": "小写罗马数字",
            "Upper Alpha": "大写英文字母",
            "Upper Roman": "大写罗马数字",
        },
    },
    createAttributes: {
        blockquote: {
            style: `
      display: block;
      padding: 16px;
      margin: 0 0 24px;
      border-left: 8px solid #dddfe4;
      background: #eef0f4;
      color: rgba(0, 0, 0, 0.5);
      overflow: auto;
      word-break: break-word !important;`,
            class: "blockquote-box", //在css中编写类名对应的样式
        },
    },
    sourceEditorCDNUrlsJS: [
        // "https://cdnjs.cloudflare.com/ajax/libs/ace/1.4.2/ace.js",
        "https://cdn.staticfile.org/ace/1.4.2/ace.js",
    ],
    beautifyHTMLCDNUrlsJS: [
        "https://cdn.staticfile.org/js-beautify/1.14.4/beautifier.min.js",
        "https://cdn.staticfile.org/js-beautify/1.14.4/beautify-html.min.js",
    ],

    //disablePlugins: "stat", //要禁用的插件，以逗号分割。stat是底部字符数与单词数统计
    buttons:
        "source,bold,italic,underline,strikethrough,eraser,superscript,subscript,ul,ol,indent,outdent,left,font,fontsize,paragraph,brush,lineHeight,image,file,video,copyformat,selectall,hr,table,link,symbols,undo,redo,fullsize,preview",
    controls: {
        font: {
            list: Jodit.atom({
                "Microsoft YaHei": "微软雅黑",
                KaiTi: "楷体",
                方正喵呜体: "方正喵呜体",
                "思源宋体 Heavy": "思源宋体",
                SimHei: "黑体",
                NSimSun: "新宋体",
                华文行楷: "华文行楷",
            }),
        },
    },
    uploader: {
        url: "http://localhost:8089/upload/img", //上传地址
        insertImageAsBase64URI: false, // 本地预览
        withCredentials: true,
        method: "POST",
        headers: {
            // 根据后端需求设置 Content-Type
            //"Content-Type": "multipart/form-data",
            'token': useUserStore().getToken() || ''
        },
        prepareData(Uploader, formData) {
            return formData;
        },
        isSuccess(res) {
            return res;
        },
        defaultHandlerSuccess(data) {
            console.log("defaultHandlerSuccess", data);
            if (Array.isArray(data)) {
                data.forEach((item) => {
                    if (item.url) {
                        editorInstance.insertImage(item.url);
                    } else {
                        console.warn("Item does not have a url property:", item);
                    }
                });
            } else {
                console.warn("Unexpected upload response:", data);
            }
        },

        defaultHandlerError(err) {
            console.log("defaultHandlerError", err);
            this.jodit.events.fire("errorMessage", err);
        },
        error(err) {
            console.log("error", err);
            this.jodit.events.fire("errorMessage", "文件上传失败");
        },
    },
};
// 使用 axios 发送文件上传请求的示例函数
const uploadFile = async (file) => {
    try {
        const formData = new FormData();
        console.log("文件：",file);
        formData.append('file', file);
        if (file === null) {
            message.error('请选择文件');
        }
        const response = await myAxios.post('http://localhost:8089/upload/img', formData, {
            headers: {
                //'Content-Type': 'multipart/form-data',
                'token': useUserStore().getToken() || '',
            }
        });
        console.log(response.data);
    } catch (error) {
        console.error(error);
    }
};
onMounted(() => {
    editorInstance = Jodit.make("#editorRef", { ...config, ...props.config }); //合并组件传入的配置项并创建实例
    editorInstance.value = props.modelValue;
    editorInstance.events.on("change", (newValue) => {
        emit("update:modelValue", newValue);
    });
});
onBeforeUnmount(() => {
    editorInstance.destruct(); //组件销毁
    editorInstance = null;
});
watch(
    () => props.modelValue,
    (newValue) => {
        if (editorInstance.value !== newValue) {
            editorInstance.value = newValue;
        }
    }
);
</script>

<style lang="less">
.jodit-checkbox,
.jodit-ui-checkbox__input {
  appearance: auto;
  -webkit-appearance: checkbox;
}
.jodit .jodit-input {
  color: #666;
}
.jodit-ui-button_variant_primary {
  background-color: var(--themeColor);
}
.jodit-ui-button_variant_primary:hover:not([disabled]) {
  background-color: var(--themeColor-hover);
}
// .jodit-container {
// blockquote-box {
//   display: block;
//   padding: 16px;
//   margin: 0 0 24px;
//   border-left: 8px solid #dddfe4;
//   background: #eef0f4;
//   color: rgba(0, 0, 0, 0.5);
//   overflow: auto;
//   word-break: break-word !important;
// }
// }
.jodit-workplace {
  ol,
  ul,
  li {
    list-style-position: inside;
  }
}
</style>
