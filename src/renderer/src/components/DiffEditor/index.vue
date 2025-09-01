<template>
    <div id="diffEditorContainer" ref="diffEditorRef">
        <div class="back-top-affix iconfont icon-back-up" @click="scrollPosTop" v-show="showBackTopAffix">
        </div>
    </div>
</template>

<script setup>
import { initMonaco } from '@/config/useMonacoWork'
// import * as monaco from 'monaco-editor';	// 全部导入
import { getMonacoOptions } from '@/config/monacoOptions';
import { ref, onMounted, onUnmounted, toRaw, nextTick } from 'vue';
import useAppInfoStore from '@/store/modules/appInfo'
import { editorPool } from '@/utils/EditorPool'

const appInfoStore = useAppInfoStore();
const monaco = initMonaco()
const props = defineProps({
    options: {
        type: Object,
        default: {}
    },
    autoFocus: {
        type: Boolean,
        default: false
    }
})
// 当前焦点状态
const focusState = ref({
    original: false,
    modified: false
})
const diffEditorRef = ref(null);
const diffEditorInstance = ref(null);
const showBackTopAffix = ref(false);

const diffEditorOptions = {
    renderMarginRevertIcon: true,           // 在每一行的左侧显示回滚的小图标，没看到哇？
    maxComputationTime: 5000,               // 计算差异的周期 ms
    maxFileSize: 50,                        // 最大文件 MB
    ignoreTrimWhitespace: true,             // 忽略空格差异
    renderIndicators: true,                 // 新增和删除的行是否显示加号和减号
    renderMarginRevertIcon: true,           // 在每一行的左侧显示回滚的小图标，没看到哇？
    renderOverviewRuler: false,             // 不显示右侧差异概览标尺
    originalEditable: true,                 // 原始文本是否可编辑，默认为false
    diffCodeLens: true,
    splitViewDefaultRatio: 0.53,            // 左侧默认占整体宽度的比例 数字 0-1 之间 默认是 0.5
    renderSideBySide: true,                 // 是否并排渲染；如果是false，则会嵌套渲染
    useInlineViewWhenSpaceIsLimited: true,  // 如果 renderSideBySide 设置为true，宽度小于renderSideBySideInlineBreakpoint
    renderSideBySideInlineBreakpoint: 500,
    autoDetectHighContrast: true,           // 自定修正高对比度
    enableSplitViewResizing: true,          // 启用分割视图调整大小
    wordWrap: 'off',                        // 差异编辑器禁用自动换行
    renderLineHighlight: 'line',            // 控制代码编辑器中行高亮显示的位置：'none': 不显示行高亮；'gutter': 将行高亮显示在编辑器的行号区域 'line': 将行高亮显示在整个行的左侧背景区域
}

onMounted(async () => {
    await nextTick();
    await initMonacoEditor();
});


const initMonacoEditor = async () => {
    if (!diffEditorRef.value) return;
    // 合并配置
    const defaultEditorOptions = getMonacoOptions();
    const editorOptions = {
        ...defaultEditorOptions,
        ...diffEditorOptions,
        ...props.options
    };

    // 创建编辑器实例
    initEditorStyle();
    diffEditorInstance.value = monaco.editor.createDiffEditor(diffEditorRef.value, editorOptions);
    const diffEditorRaw = toRaw(diffEditorInstance.value);
    diffEditorRaw.setModel({
        original: monaco.editor.createModel('', props.options.language),
        modified: monaco.editor.createModel('', props.options.language)
    });
    // 注册到对象池
    editorPool.add(diffEditorInstance.value);

    // 自动设置焦点
    if (props.autoFocus) {
        diffEditorRaw.getOriginalEditor().focus();
    }

    // 监听编辑器鼠标焦点位置变化
    const { originalInstance, modifiedInstance } = getDiffEditorInstance();
    changeCursorPosition(originalInstance);
    changeCursorPosition(modifiedInstance);

    // 编辑器字数统计
    getWordsLength(originalInstance)
    getWordsLength(modifiedInstance)

    // 编辑器失去焦点
    handelBlurEditorWidget(originalInstance)
    handelBlurEditorWidget(modifiedInstance)

    // 监听滚动事件
    originalInstance.onDidScrollChange((e) => {
        if (e.scrollTop > 50) {
            showBackTopAffix.value = true;
        } else {
            showBackTopAffix.value = false;
        }
    });

    // 设置编辑器当前焦点
    changeEditorFocusState(originalInstance, modifiedInstance)
}

/**
 * 切换差异编辑器语言
 * @param language 
 */
const setDiffEditorLanguage = (language) => {
    const { originalModel, modifiedModel } = getDiffEditorModel();
    if (originalModel && modifiedModel) {
        monaco.editor.setModelLanguage(originalModel, language);
        monaco.editor.setModelLanguage(modifiedModel, language);
    }
};


/**
 * 设置编辑器内容
 * @param value 
 */
const setDiffEditorValue = (value) => {
    const { originalModel, modifiedModel } = getDiffEditorModel();
    if (originalModel && modifiedModel) {
        originalModel.setValue(value);
        modifiedModel.setValue(value);
    }
}

/**
 * 获取编辑器Model
 */
const getDiffEditorModel = () => {
    if (!diffEditorInstance.value) return;
    const diffEditorRaw = toRaw(diffEditorInstance.value);
    const originalModel = diffEditorRaw.getOriginalEditor().getModel();
    const modifiedModel = diffEditorRaw.getModifiedEditor().getModel();
    return { originalModel, modifiedModel }
}

/**
 * 获取编辑器实例
 */
const getDiffEditorInstance = () => {
    if (!diffEditorInstance.value) return;
    const diffEditorRaw = toRaw(diffEditorInstance.value);
    const originalInstance = diffEditorRaw.getOriginalEditor();
    const modifiedInstance = diffEditorRaw.getModifiedEditor();
    return { originalInstance, modifiedInstance }
}

/**
 * 改变鼠标位置
 * @param editorInstance 
 */
const changeCursorPosition = (editorInstance) => {
    editorInstance.onDidChangeCursorPosition((e) => {
        let position = e.position;
        appInfoStore.updateCursorPos(position);
        // 鼠标改变时，统计字符数
        let wordsNum = editorInstance.getModel().getValueLength();
        appInfoStore.updateBarWords(wordsNum);
    })
}

/**
 * 获取编辑器字符数
 * @param editorInstance 
 */
const getWordsLength = (editorInstance) => {
    editorInstance.onDidChangeModelContent(() => {
        let wordsNum = editorInstance.getModel().getValueLength();
        appInfoStore.updateBarWords(wordsNum);
    });
}

/**
 * 编辑器失去焦点
 * @param editorInstance 
 */
const handelBlurEditorWidget = (editorInstance) => {
    editorInstance.onDidBlurEditorWidget(() => {
        appInfoStore.updateCursorPos({ lineNumber: 0, column: 0 })
    })
}

/**
 * 滚动到最顶部
 */
const scrollPosTop = () => {
    scrollPos({ row: 1, column: 1 })
}

/**
 * 设置滚动位置
 * @param param0 
 */
const scrollPos = ({ row, column }) => {
    const { originalInstance } = getDiffEditorInstance();
    originalInstance.revealPosition({ lineNumber: row, column: column }, 0);
}

/**
 * 设置编辑器当前焦点
 * @param originalInstance 
 * @param modifiedInstance 
 */
const changeEditorFocusState = (originalInstance, modifiedInstance) => {
    originalInstance.onDidFocusEditorText(() => {
        focusState.value = {
            original: true,
            modified: false
        }
    })
    modifiedInstance.onDidFocusEditorText(() => {
        focusState.value = {
            original: false,
            modified: true
        }
    })
}

/**
 * 更新编辑器配置
 * @param options 
 */
const updateOpts = (options) => {
    toRaw(diffEditorInstance.value).updateOptions(options);
}

/**
 * 取消拖拽条的左右两侧的阴影
 */
const initEditorStyle = () => {
    // 创建并插入样式表
    const style = document.createElement('style');
    style.textContent = `
        .monaco-diff-editor {
            --vscode-scrollbar-shadow: transparent !important;
        }
        .monaco-scrollable-element::before {
            box-shadow: none !important;
            background: none !important;
        }
    `;
    document.head.appendChild(style);
}

// 当组件被卸载时调用该回调函数
onUnmounted(async () => {
    try {
        // 检查 editor 是否已初始化
        if (diffEditorInstance.value) {
            // 清理 editor 资源，避免内存泄漏
            await toRaw(diffEditorInstance.value).dispose();
        } else {
            Logger.error('diffEditor 未初始化');
        }
    } catch (error) {
        Logger.error('清理 diffEditor 资源时出错:', error);
    } finally {
        Logger.info('diffEditor组件销毁完成');
    }
});

defineExpose({
    focusState,
    setDiffEditorLanguage,
    setDiffEditorValue,
    getDiffEditorModel,
    updateOpts
})

</script>

<style scoped lang="scss">
#diffEditorContainer {
    width: calc(100% - 5px);
    // height: calc(100% - 46px);
    height: 100%;

    .back-top-affix {
        position: fixed;
        z-index: 999;
        right: 20px;
        bottom: 35px;
        width: 35px;
        height: 35px;
        line-height: 35px;
        text-align: center;
        cursor: pointer;
        border-radius: 50%;

        &:hover {
            color: rgb(58, 129, 253);
            font-weight: 800;
        }
    }

    // 差异编辑器中间分隔条的边框
    :deep(.monaco-editor) {
        --vscode-focusBorder: transparent !important;
    }

    // 鼠标移到分隔条，出现蓝色背景(取消)
    :deep(.monaco-sash.vertical.hover) {
        --vscode-sash-hoverBorder: transparent !important;
    }
}
</style>