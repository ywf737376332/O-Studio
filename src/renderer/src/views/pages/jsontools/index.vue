<template>
  <div class="editor-container">
    <div class="top-menu no-drag">
      <div class="setting-pane">
        <JsonEditorConfigPopover @handleOptionsChange="handleOptionsChange" />
      </div>
      <ToolBar :funMenuList="funMenuList" class="fun-pane" :width="20"></ToolBar>
    </div>
    <div class="editor-content">
      <CodingEditor ref="codingEditorRef" :options="options" :autoFocus="true" @change="handleEditorChange" />
    </div>
    <JsonViewDrawer :showDrawer="showJsonViewDrawer" :jsonText="jsonViewText" @handleClose="handleJsonViewClose" />
  </div>
</template>

<script setup name="JsonTools">
import { ref, reactive } from 'vue'
import CodingEditor from '@/components/CodingEditor/index.vue'
import JsonEditorConfigPopover from '@/components/JsonEditorConfigPopover/index.vue'
import { ToolBar } from '@/layout/components'
import {
  compressJson,
  escapeJson,
  unEscapeJson,
  validJSON,
  sortJsonString,
  formatMixedJson
} from '@/utils/beautifyJson'
import JsonViewDrawer from '@/components/JsonViewDrawer/index.vue'

const codingEditorRef = ref(null)
const showJsonViewDrawer = ref(false)
const convertState = ref("off")
const shouldParseEscaped = ref(false)

const jsonViewText = ref('')

const options = reactive({
  language: 'json'
})

// 处理编辑器内容变化的方法
const handleEditorChange = (value) => { }

const handleJsonViewClose = () => {
  showJsonViewDrawer.value = false
}

const sortType = ref('ref')
const computedSort = () => {
  if (sortType.value === 'asc') {
    sortType.value = 'desc'
  } else {
    sortType.value = 'asc'
  }
}

const handleOptionsChange = (opts) => {
  convertState.value = opts?.convertState
  shouldParseEscaped.value = opts?.shouldParseEscaped
}

const funMenuList = [
  {
    menuName: '清空',
    menuIco: 'icon-clean',
    position: 'right',
    menuFun: () => {
      codingEditorRef.value.setEditorValue('')
    }
  },
  {
    menuName: '预览',
    menuIco: 'icon-json-viewer',
    position: 'right',
    menuFun: () => {
      const value = codingEditorRef.value.getEditorValue()
      if (value && validJSON(value)) {
        jsonViewText.value = compressJson(value)
        showJsonViewDrawer.value = true
      }
    }
  },
  {
    menuName: '转义',
    menuIco: 'icon-escape',
    position: 'right',
    menuFun: () => {
      const value = codingEditorRef.value.getEditorValue()
      if (value && validJSON(value)) {
        codingEditorRef.value.setEditorValue(escapeJson(compressJson(value)))
      }
    }
  },
  {
    menuName: '去除转义',
    menuIco: 'icon-un-escape',
    position: 'right',
    menuFun: () => {
      const value = codingEditorRef.value.getEditorValue()
      if (value && validJSON(value)) {
        codingEditorRef.value.setEditorValue(unEscapeJson(value))
      }
    }
  },
  {
    menuName: '压缩',
    menuIco: 'icon-compress',
    position: 'right',
    menuFun: () => {
      const value = codingEditorRef.value.getEditorValue()
      if (value && validJSON(value)) {
        codingEditorRef.value.setEditorValue(compressJson(value))
      }
    }
  },
  {
    menuName: '排序',
    menuIco: 'icon-sort',
    position: 'right',
    menuFun: () => {
      const value = codingEditorRef.value.getEditorValue()
      if (value && validJSON(value)) {
        computedSort()
        codingEditorRef.value.setEditorValue(sortJsonString(value, { sortType: sortType.value }))
      }
    }
  },
  {
    menuName: '格式化',
    menuIco: 'icon-formatCode',
    position: 'right',
    menuFun: () => {
      const value = codingEditorRef.value.getEditorValue()
      if (value && validJSON(value)) {
        codingEditorRef.value.setEditorValue(formatMixedJson(value, 4, shouldParseEscaped.value, convertState.value))
      }
    }
  }
]
</script>

<style scoped lang="scss">
.editor-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;

  .top-menu {
    height: 46px;
    box-sizing: border-box;

    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;

    .setting-pane {
      margin: 15px 0 8px 0;
      padding: 0 20px;
    }

    .fun-pane {
      flex: 1;
    }
  }

  .editor-content {
    width: 100%;
    // height: calc(100% - 71px);
    flex: 1;
  }
}
</style>
