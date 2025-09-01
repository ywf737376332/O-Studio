<template>
  <div class="editor-container">
    <div class="top-menu">
      <div class="setting-pane">
        <LanguagePopover ref="languagePopoverRef" v-model="selectLanguage" @changeLanguage="changeLanguage" />
      </div>
      <ToolBar :funMenuList="funMenuList"></ToolBar>
    </div>
    <div class="editor-content">
      <CodingEditor ref="codingEditorRef" :options="options" :autoFocus=true @change="handleEditorChange" />
    </div>
    <HtmlViewDrawer :showDrawer="showCodeViewDrawer" :htmlCode="htmlCode" :textCode="viewText"
      @handleClose="handleCodeViewClose" />
  </div>
</template>

<script setup name="CodeCopy">
import { ref, reactive, onActivated } from 'vue';
import { ToolBar } from '@/layout/components'
import { formatJson } from '@/utils/beautifyJson';
import { formatCode } from '@/utils/beautifyHtml';
import { formatSql } from '@/utils/beautifySql';
import { formatXml } from '@/utils/beautifyXml';
import { copyTextToClipboard } from '@/utils/download'
import CodingEditor from '@/components/CodingEditor/index.vue';
import HtmlViewDrawer from '@/components/HtmlViewDrawer/index.vue'
import { Message } from '@/utils/message'
import LanguagePopover from '@/components/LanguagePopover/index.vue'
import useAppInfoStore from '@/store/modules/appInfo'
const appInfoStore = useAppInfoStore();

const languagePopoverRef = ref(null)
const codingEditorRef = ref(null);

const options = reactive({
  value: '',
  language: 'plaintext',
})

const selectLanguage = ref('plaintext')
const changeLanguage = (value, label) => {
  codingEditorRef.value.setLanguage(value)
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

// 处理编辑器内容变化的方法
const handleEditorChange = (value) => {
};

// 代码预览窗口
const showCodeViewDrawer = ref(false);
const htmlCode = ref('');
const viewText = ref('');
const handleCodeViewClose = () => {
  showCodeViewDrawer.value = false;
}

const beautifyCode = (language) => {
  const editorInstance = codingEditorRef.value;
  const value = editorInstance?.getEditorValue();
  if (value) {
    switch (language) {
      case 'json': {
        editorInstance.setEditorValue(formatJson(value));
        break;
      }
      case 'javascript': {
        editorInstance.setEditorValue(formatCode(value, 'js'));
        break;
      }
      case 'html': {
        editorInstance.setEditorValue(formatCode(value, 'html'));
        break;
      }
      case 'css': {
        editorInstance.setEditorValue(formatCode(value, 'css'));
        break;
      }
      case 'xml': {
        editorInstance.setEditorValue(formatXml(value));
        break;
      }
      case 'sql': {
        editorInstance.setEditorValue(formatSql(value));
        break;
      }
    }
  }
}

const funMenuList = [
  {
    menuName: '清空',
    menuIco: 'icon-clean',
    position: 'right',
    menuFun: () => {
      codingEditorRef.value.setEditorValue("");
    }
  },
  {
    menuName: '预览',
    menuIco: 'icon-json-viewer',
    position: 'right',
    menuFun: async () => {
      await codePreview()
    }
  },
  {
    menuName: '复制',
    menuIco: 'icon-copy',
    position: 'right',
    menuFun: () => {
      const value = codingEditorRef.value.getEditorValue();
      if (value) {
        copyTextToClipboard(value)
      }
    }
  },
  {
    menuName: '美化',
    menuIco: 'icon-formatCode',
    position: 'right',
    menuFun: () => {
      beautifyCode(selectLanguage.value)
    }
  }
]

const codePreview = async () => {
  const codingEditorInstance = codingEditorRef.value;
  const value = codingEditorInstance.getEditorValue();
  if (value) {
    htmlCode.value = await codingEditorInstance.colorizeHtml()
    viewText.value = value;
    showCodeViewDrawer.value = true;
  }
}

</script>

<style scoped lang="scss">
.editor-container {
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
    // height: 100%
    flex: 1;
  }
}
</style>