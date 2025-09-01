<template>
  <div class="main-container">
    <div class="top-menu no-drag">
      <ToolBar class="fun-pane" :width="80" :funMenuList="funMenuList"></ToolBar>
    </div>
    <div class="split-panes">
      <splitpanes class="default-theme" style="height: 100%">
        <template v-for="(editor, index) in editors">
          <pane min-size="20">
            <CodingEditor
              :ref="(el) => setRef(el, editor.id)"
              :key="editor.id"
              :options="editorOptions"
            />
          </pane>
        </template>
      </splitpanes>
    </div>
  </div>
</template>

<script setup name="HttpTools">
import { ref, reactive, computed, watch, nextTick } from 'vue'
import CodingEditor from '@/components/CodingEditor/index.vue'
import { ToolBar } from '@/layout/components'
import { Splitpanes, Pane } from 'splitpanes'
import 'splitpanes/dist/splitpanes.css'
import { Message } from '@/utils/message'

const originalEditorRef = ref(null)

const editorOptions = reactive({
  value: '',
  language: 'json',
  readOnly: false
})
let editorId = ref(1)
// 编辑器实例管理
const editors = ref([
  {
    id: `editorIns${editorId.value}`,
    options: {
      value: '',
      language: 'java',
      readOnly: false
    }
  }
])

const paneSize = computed(() => editors.value.length)
//const language = computed(() => originalEditorRef.value ? originalEditorRef.value.getLanguage() : "")
const refsMap = new Map()
const setRef = (el, id) => {
  if (el) {
    refsMap.set(id, el) // 将元素和 id 关联存储
  }
}

const handleCreateNewEditor = () => {
  Logger.info('当前：', paneSize.value)
  if (paneSize.value >= 6) {
    Message({
      message: `最多只能创建${paneSize.value}个分栏编辑器`,
      type: 'warning'
    })
    return
  }
  editorId.value++
  editors.value.push({
    id: `editorIns${editorId.value}`,
    options: {
      value: '',
      language: 'java',
      readOnly: false
    }
  })
}

// 移除分栏
const removeEditor = (index) => {
  Logger.info('refsMap:', refsMap)
  if (editors.value.length <= 1) return
  editors.value.splice(index, 1)
}

const funMenuList = [
  {
    menuName: '新建编辑器',
    menuIco: 'icon-compress',
    position: 'right',
    menuFun: () => {
      handleCreateNewEditor()
    }
  },
  {
    menuName: '移除编辑器',
    menuIco: 'icon-compress',
    position: 'right',
    menuFun: () => {
      removeEditor()
    }
  },
  {
    menuName: '格式化第二个',
    menuIco: 'icon-compress',
    position: 'right',
    menuFun: () => {
      const editorIns = refsMap.get(`editorIns1`)
      Logger.info('值：', editorIns.getEditorFocusInstance())
    }
  }
]
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
