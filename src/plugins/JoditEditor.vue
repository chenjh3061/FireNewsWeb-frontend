<template>
    <textarea id="editorRef" ref="editorRef" name="editor"></textarea>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from "vue";

import 'jodit/es2021/jodit.min.css';
import "jodit/esm/plugins/add-new-line/add-new-line.js";
import "jodit/esm/plugins/copy-format/copy-format.js";
import "jodit/esm/plugins/fullsize/fullsize.js";
import "jodit/esm/plugins/hr/hr.js";
import "jodit/esm/plugins/line-height/line-height.js";
import "jodit/esm/plugins/preview/preview.js";
import "jodit/esm/plugins/source/source.js";
import "jodit/esm/plugins/symbols/symbols.js";
import 'jodit/esm/plugins/table/table.js';
import "jodit/esm/plugins/file/file.js";
import "jodit/esm/plugins/video/video.js";
import "jodit/esm/plugins/paste/paste.js";
import "jodit/esm/plugins/resizer/resizer.js";
import "jodit/esm/plugins/search/search.js";
import "jodit/esm/plugins/select/select.js";
import "jodit/esm/plugins/spellcheck/spellcheck.js";
import { Jodit } from "jodit";
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
    statusbar: true, //底部状态栏(左：html元素；右：单词数，字符数统计)
    allowResizeTags: new Set(['img']),
    resizer: {
        showSize: true,
        hideSizeTimeout: 2000,
        useAspectRatio: true, //['img', 'table'],
        forImageChangeAttributes: true,
        min_width: 10,
        min_height: 10
    },
    image: {
        //图片相关配置
        editSrc: true,
        editStyle: true,
        useImageEditor: true,
        resizer: {
            showSize: true,  // 拖拽时显示尺寸
            hideSizeTimeout: 2000, // 尺寸提示隐藏延迟
            forImage: true,  // 允许调整图片大小
            min_width: 50,   // 最小宽度
            min_height: 50,  // 最小高度
            enable: true, // 允许调整大小
            // 其他配置...
        }

    },
    link: {
        noFollowCheckbox: true,
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
        "source,bold,italic,underline,strikethrough,eraser,superscript,subscript,ul,ol," +
        "indent,outdent,align,left,center,right,font,fontsize,paragraph,brush,lineHeight,image,file,video,copyformat," +
        "selectall,hr,table,link,symbols,undo,redo,fullsize,preview,spellcheck,search",
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
        format: "json",
        filesVariableName: (index) => "file",
        prepareData(formData) {
            const file = formData.get('file');
            if (file) {
                formData.delete('file');
                formData.append('file', file);
            }
            console.log("prepareData", file);
            return formData;
        },
        image: {
            url: "http://localhost:8089/upload/img", // 图片上传接口
            method: "POST",
            headers: {
                "Content-Type": "multipart/form-data"
            }
        },
        file: {
            url: "http://localhost:8089/upload/document", // 文件上传接口
            method: "POST",
            headers: {
                "Content-Type": "multipart/form-data"
            }
        },
        video: {
            url: "http://localhost:8089/upload/document", // 视频上传接口
            method: "POST",
            headers: {
                "Content-Type": "multipart/form-data"
            }
        },
        isSuccess(res) {
            console.log("isSuccess", res);
            return res;
        },
        defaultHandlerSuccess(data) {
            console.log("defaultHandlerSuccess", data);
            const imageUrl = "http://localhost:8089" + data; // 根据你自己的后端路径拼接
            const imageHtml = `<img src="${imageUrl}" style="max-width: 700px; max-height: 500px;
                                display: block; margin: 0 auto;" />`;
            this.s.insertHTML(imageHtml);
            //this.s.insertImage(imageUrl); // 插入图片，并添加样式
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

onMounted(() => {
    editorInstance = Jodit.make("#editorRef", { ...config, ...props.config }); //合并组件传入的配置项并创建实例
    editorInstance.value = props.modelValue;
    editorInstance.events.on("change", (newValue) => {
        emit("update:modelValue", newValue);

    });

    // 监听图片插入事件
    editorInstance.events.on('afterInsertImage', function (e) {
        const imageElement = e.target; // 获取插入的图片元素
        if (imageElement && imageElement.tagName.toLowerCase() === 'img') {
            imageElement.style.resize = 'both'; // 启用拖拽调整大小
            imageElement.style.overflow = 'hidden'; // 防止溢出
            imageElement.style.cursor = 'news-resize'; // 更改光标为调整大小的样式
        }
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
 .jodit-container {
 blockquote-box {
   display: block;
   padding: 16px;
   margin: 0 0 24px;
   border-left: 8px solid #dddfe4;
   background: #eef0f4;
   color: rgba(0, 0, 0, 0.5);
   overflow: auto;
   word-break: break-word !important;
 }
 }
.jodit-workplace {
  ol,
  ul,
  li {
    list-style-position: inside;
  }
}
.jodit-wysiwyg img {
    max-width: 100% !important;  /* 限制图片最大宽度为容器宽度 */
    height: auto !important;     /* 高度自适应 */
    display: block;              /* 确保居中生效 */
    margin: 10px auto;           /* 上下边距 10px，水平居中 */
    resize: both;            /* 允许图片被拖动调整大小 */
    overflow: hidden;        /* 隐藏超出部分 */
}
</style>
