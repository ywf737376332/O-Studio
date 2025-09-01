<template>
    <div class="main-container">
        <div class="top-menu no-drag">
            <div class="toggle-fun">
                <ToggleGroup v-model:val="convertType" :funList="funList"></ToggleGroup>
            </div>
            <ToolBar class="fun-pane" :width="80" :funMenuList="funMenuList"></ToolBar>
        </div>
        <div class="split-panes">
            <splitpanes class="default-theme" style="height: 100%">
                <pane min-size="20" size="50">
                    <CodingEditor ref="originalEditorRef" :options="originalOptions" :autoFocus=true />
                </pane>
                <pane min-size="30" size="48">
                    <CodingEditor ref="modifieEditorRef" :options="modifieOptions" @change="handleEditorChange" />
                </pane>
            </splitpanes>
        </div>
        <HtmlViewDrawer :showDrawer="showCodeViewDrawer" :htmlCode="htmlCode" :textCode="viewText"
            @handleClose="handleCodeViewClose" />
    </div>
</template>

<script setup name="JsonConvertJavaScript">
import { ref, reactive, watch, nextTick, computed } from 'vue';
import CodingEditor from '@/components/CodingEditor/index.vue';
import { ToolBar } from '@/layout/components'
import ToggleGroup from '@/components/ToggleGroup/index.vue'
import { Splitpanes, Pane } from 'splitpanes'
import 'splitpanes/dist/splitpanes.css'
import JavaScriptConverter from '@/utils/JavaScriptConverter';
import { formatJson, compressJson } from '@/utils/beautifyJson';
import { Message } from '@/utils/message'
import { formatCode } from '@/utils/beautifyHtml';
import HtmlViewDrawer from '@/components/HtmlViewDrawer/index.vue'

const originalEditorRef = ref(null);
const modifieEditorRef = ref(null);
const convertType = ref('jsonToJs')

const originalOptions = reactive({
    value: '',
    language: 'json',
    readOnly: false
})

const modifieOptions = reactive({
    value: '',
    language: 'javascript',
    readOnly: true
})

watch(convertType, () => {
    const originalEditorInstance = originalEditorRef.value;
    const modifieEditorInstance = modifieEditorRef.value;
    // 切换语言
    if (convertType.value === 'jsonToJs') {
        originalEditorInstance.setLanguage('json')
        modifieEditorInstance.setLanguage('javascript')
    } else if (convertType.value === 'JsToJson') {
        originalEditorInstance.setLanguage('javascript')
        modifieEditorInstance.setLanguage('json')
    }
    // 切换时，直接清除内容
    handleRemove()
})

const handleEditorChange = (value) => {
}


/**
 * 类型转换
 */
const handleTypeConvert = () => {
    const originalEditorInstance = originalEditorRef.value;
    const modifieEditorInstance = modifieEditorRef.value;
    try {
        if (convertType.value === 'jsonToJs') {
            const originalEditorVal = originalEditorInstance.getEditorValue();
            const convertResult = JavaScriptConverter.toJavaScript(originalEditorVal);
            modifieEditorInstance.setEditorValue(convertResult)
        } else if (convertType.value === 'JsToJson') {
            const originalEditorVal = originalEditorInstance.getEditorValue();
            const convertResult = JavaScriptConverter.jsToJson(originalEditorVal);
            modifieEditorInstance.setEditorValue(convertResult)
        }
    } catch (error) {
        Message({
            message: `${error.message}`,
            type: 'error'
        })
    }
};

/**
 * 格式化代码
 */
const handleBeautifyCode = () => {
    const originalEditorInstance = originalEditorRef.value;
    const originalEditorVal = originalEditorInstance.getEditorValue();
    if (originalEditorVal) {
        if (convertType.value === 'jsonToJs') {
            originalEditorInstance.setEditorValue(formatJson(originalEditorVal))
        } else if (convertType.value === 'JsToJson') {
            originalEditorInstance.setEditorValue(formatCode(originalEditorVal), 'js')
        }
    }
}

/**
 * 压缩代码
 */
const handleCompressCode = () => {
    const originalEditorInstance = originalEditorRef.value;
    const originalEditorVal = originalEditorInstance.getEditorValue();
    if (originalEditorVal) {
        if (convertType.value === 'jsonToJs') {
            originalEditorInstance.setEditorValue(compressJson(originalEditorVal))
        } else if (convertType.value === 'JsToJson') {
            originalEditorInstance.setEditorValue(JavaScriptConverter.compressJs(originalEditorVal))
        }
    }
}

/**
 * 清空编辑器
 */
const handleRemove = () => {
    nextTick(() => {
        const originalEditorInstance = originalEditorRef.value;
        const modifieEditorInstance = modifieEditorRef.value;
        originalEditorInstance.setEditorValue('')
        modifieEditorInstance.setEditorValue('')
    })
}

// 代码预览窗口
const showCodeViewDrawer = ref(false);
const htmlCode = ref('');
const viewText = ref('');
const handleCodeViewClose = () => {
    showCodeViewDrawer.value = false;
}

const funList = [
    {
        text: "JSON 转 JS",
        value: "jsonToJs"
    },
    {
        text: "JS 转 JSON",
        value: "JsToJson"
    }
]

const funMenuList = [
    {
        menuName: '压缩',
        menuIco: 'icon-compress',
        position: 'left',
        menuFun: () => {
            handleCompressCode()
        }
    },
    {
        menuName: '美化',
        menuIco: 'icon-formatCode',
        position: 'left',
        menuFun: () => {
            handleBeautifyCode()
        }
    },
    {
        menuName: '清空',
        menuIco: 'icon-clean',
        position: 'right',
        menuFun: () => {
            handleRemove()
        }
    },
    {
        menuName: '转换',
        menuIco: 'icon-convert-type',
        position: 'right',
        menuFun: () => {
            handleTypeConvert()
        }
    },
    {
        menuName: '预览',
        menuIco: 'icon-json-viewer',
        position: 'right',
        menuFun: async () => {
            await codePreview()
        }
    }
]

const codePreview = async () => {
    const modifieEditorInstance = modifieEditorRef.value;
    const value = modifieEditorInstance.getEditorValue();
    if (value) {
        htmlCode.value = await modifieEditorInstance.colorizeHtml()
        viewText.value = value;
        showCodeViewDrawer.value = true;
    }
}

</script>


<style scoped lang="scss">
.main-container {
    width: 100%;
    // height: calc(100% - 83px);
    height: 100%;
    display: flex;
    flex-direction: column;

    .top-menu {
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
        align-items: center;

        .toggle-fun {
            display: flex;
            flex-direction: row;
            margin: 15px 0 8px 0;
            padding: 0 20px;
        }

        .fun-pane {
            flex: 1;
        }
    }

    .split-panes {
        width: 100%;
        // height: calc(100% - 36px);
        flex: 1;
        display: flex;
        flex-direction: row;
        padding: 0 10px 0 10px;

        :deep(.splitpanes__pane) {
            display: flex;
            justify-content: center;
            align-items: center;
        }

        :deep(.el-textarea__inner) {
            width: 99%;
            height: 100%;
            white-space: pre-wrap;
            /* 保持文本的换行 */
            word-wrap: break-word;
            /* 长单词或 URL 地址自动换行 */
            overflow-x: hidden;
            /* 禁用横向滚动条 */
        }

        :deep(.splitpanes.default-theme .splitpanes__pane) {
            background-color: #FFF;
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            background-color: var(--main-background-color);
        }

        :deep(.splitpanes__splitter) {
            border-left: 1px solid var(--main-border-color);
            background-color: var(--main-background-color);
        }

        .el-textarea {
            width: 100%;
            height: 100%;
            background-color: #fff;
        }
    }
}
</style>