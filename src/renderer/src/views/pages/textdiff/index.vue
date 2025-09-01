<template>
  <div class="diff-editor-container">
    <div class="top-menu no-drag">
      <div class="setting-pane">
        <LanguagePopover ref="languagePopoverRef" v-model="selectLanguage" @changeLanguage="changeLanguage" />
      </div>
      <div class="setting-pane">
        <DiffEditorConfigPopover @handleOptionsChange="handleOptionsChange" />
      </div>
      <ToolBar :funMenuList="funMenuList" class="fun-pane" :width="20"></ToolBar>
    </div>
    <div class="diff-editor-content">
      <DiffEditor ref="codingEditorRef" :options="options" :autoFocus=true />
    </div>
  </div>
</template>

<script setup name="TextDiff">
import { ref, reactive, nextTick, onActivated } from 'vue';
import DiffEditor from '@/components/DiffEditor/index.vue';
import { ToolBar } from '@/layout/components'
import { formatEditorValue } from '@/utils'
import { Message } from '@/utils/message'
import LanguagePopover from '@/components/LanguagePopover/index.vue'
import DiffEditorConfigPopover from '@/components/DiffEditorConfigPopover/index.vue'
import useAppInfoStore from '@/store/modules/appInfo'
const appInfoStore = useAppInfoStore();

const languagePopoverRef = ref(null)
const codingEditorRef = ref(null);
const options = reactive({
  language: 'plaintext'
})
const selectLanguage = ref('plaintext')
const changeLanguage = (value, label) => {
  codingEditorRef.value.setDiffEditorLanguage(value)
  appInfoStore.languageType = label;
  Message({
    message: `编辑器语言类型已修改为：${label}`,
    type: 'success'
  })
}

// 页面激活时,设置状态栏显示语言
onActivated(() => {
  const languageLabel = languagePopoverRef.value.getLanguageLabel(selectLanguage.value);
  appInfoStore.languageType = languageLabel;
})

const handleOptionsChange = (opts) => {
  codingEditorRef.value.updateOpts(opts);
}

const beautifyCode = (language) => {
  const { originalModel, modifiedModel } = codingEditorRef.value.getDiffEditorModel();
  const focusState = codingEditorRef.value.focusState;
  formatEditorValue(language, focusState.original ? originalModel : (focusState.modified ? modifiedModel : null))
}

const funMenuList = [
  {
    menuName: '清空',
    menuIco: 'icon-clean',
    position: 'right',
    menuFun: () => {
      nextTick(() => {
        codingEditorRef.value.setDiffEditorValue('')
      })
    }
  }
]


</script>

<style scoped lang="scss">
.diff-editor-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;

  .top-menu {
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

  .diff-editor-content {
    width: 100%;
    // height: 100%;
    flex: 1;
  }

  // 中间矩形边框
  :deep(.monaco-editor, .monaco-diff-editor, .monaco-component) {
    --vscode-focusBorder: #f3f3f3;
    --vscode-scrollbar-shadow: ttransparen !important;
  }
}
</style>