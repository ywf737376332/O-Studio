<template>
  <div class="editorContainer" ref="monacoEditorRef">
    <div
      class="back-top-affix iconfont icon-back-up"
      @click="scrollPosTop"
      v-show="showBackTopAffix"
    ></div>
  </div>
</template>

<script setup>
import { initMonaco } from '@/config/useMonacoWork'
//import * as monaco from 'monaco-editor';	// 全部导入
import { getMonacoOptions } from '@/config/monacoOptions'
import { ref, onMounted, onUnmounted, toRaw, nextTick } from 'vue'
import useAppInfoStore from '@/store/modules/appInfo'
import { editorPool } from '@/utils/EditorPool'
const appInfoStore = useAppInfoStore()
const monaco = initMonaco()
const props = defineProps({
  options: {
    type: Object,
    default: {}
  },
  value: {
    type: String,
    default: ''
  },
  autoFocus: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['change'])
const monacoEditorRef = ref(null)
const editorInstance = ref(null)
const showBackTopAffix = ref(false)

/**
 * 页面加载完成后,初始化编辑器
 */
onMounted(async () => {
  await nextTick()
  await initMonacoEditor()
})

const initMonacoEditor = async () => {
  if (!monacoEditorRef.value) return
  // 合并配置
  const defaultEditorOptions = getMonacoOptions()
  const editorOptions = {
    ...defaultEditorOptions,
    ...props.options,
    value: props.value // 确保使用传入的初始值
  }

  // 创建编辑器实例
  editorInstance.value = monaco.editor.create(monacoEditorRef.value, editorOptions)
  // 注册到对象池
  editorPool.add(editorInstance.value)

  // 设置焦点
  if (props.autoFocus) {
    editorInstance.value.focus()
  }
  // 监听编辑器内容变化
  editorInstance.value.onDidChangeModelContent(() => {
    // 触发父组件的 change 事件，通知编辑器内容变化
    const editorOriginal = toRaw(editorInstance.value)
    // 获取代码长度
    let wordCounts = editorOriginal.getModel().getValueLength()
    appInfoStore.updateBarWords(wordCounts)
    emit('change', editorOriginal.getValue())
  })
  // 监听光标位置变化事件
  editorInstance.value.onDidChangeCursorPosition((e) => {
    let position = e.position
    appInfoStore.updateCursorPos(position)
  })
  // 监听滚动事件
  editorInstance.value.onDidScrollChange((e) => {
    if (e.scrollTop > 50) {
      showBackTopAffix.value = true
    } else {
      showBackTopAffix.value = false
    }
  })

  editorInstance.value.onDidFocusEditorWidget(() => {

  })
  // 自定义菜单
  editorInstance.value.addAction({
    contextMenuGroupId: 'editor.action.quickOutline',
    contextMenuOrder: 1,
    id: 'custom_menu',
    keybindings: [monaco.KeyMod.Shift | monaco.KeyMod.Alt | monaco.KeyCode.KEY_F], // 快捷键
    label: '自定义菜单',
    run: () => {
      Logger.info('菜单：', monaco.editor.ContextMenuController.get(editor))
    }
  })
}

/**
 * 获取编辑器的值
 */
const getEditorValue = () => {
  return toRaw(editorInstance.value).getValue()
}

/**
 *
 * @param value 设置编辑器的值
 */
const setEditorValue = (value) => {
  toRaw(editorInstance.value).setValue(value)
}

/**
 * 设置编辑器焦点
 */
const setEditorFocus = () => {
  nextTick(() => {
    toRaw(editorInstance.value).focus()
  })
}

/**
 * 获取鼠标焦点位置
 */
const getEditorCursorPos = () => {
  return editorInstance.value.getPosition()
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
  toRaw(editorInstance.value).revealPosition({ lineNumber: row, column: column }, 0)
}

const updateOpts = () => {
  toRaw(editorInstance.value).updateOptions({
    lineNumbers: 'off'
  })
}

/**
 * 改变编辑器语言
 * @param language
 */
const setLanguage = (language) => {
  monaco.editor.setModelLanguage(toRaw(editorInstance.value).getModel(), language)
}

/**
 * 获取编辑器语言
 * @param language
 */
const getLanguage = () => {
  const editorOriginal = toRaw(editorInstance.value)
  return editorOriginal.getModel().getLanguageId()
}

/**
 * 渲染代码得到HTML
 */
const colorizeHtml = async () => {
  try {
    const editorOriginal = toRaw(editorInstance.value)
    if (editorOriginal) {
      const text = editorOriginal.getValue()
      const language = editorOriginal.getModel().getLanguageId()
      const colorHtml = await monaco.editor.colorize(text, language, {})
      return colorHtml
    }
  } catch (error) {
    throw new Error('内容获取失败！')
  }
}


defineExpose({
  getEditorValue,
  setEditorValue,
  setEditorFocus,
  getEditorCursorPos,
  scrollPosTop,
  updateOpts,
  setLanguage,
  getLanguage,
  colorizeHtml,
})

/**
 * 当组件被卸载时调用该回调函数
 */
onUnmounted(() => {
  try {
    // 检查 editor 是否已初始化
    if (editorInstance.value) {
      // 从对象池移除
      editorPool.remove(editorInstance.value)
      // 清理 editor 资源，避免内存泄漏
      toRaw(editorInstance.value).dispose()
    } else {
      Logger.warn('editor 未初始化')
    }
  } catch (error) {
    Logger.error('清理 editor 资源时出错:', error)
  } finally {
    Logger.info('editor组件销毁完成')
  }
})
</script>

<style scoped lang="scss">
.editorContainer {
  width: calc(100% - 5px);
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

  :deep(.monaco-editor) {
    --vscode-focusBorder: transparent !important;
  }
}
</style>
