<template>
  <div class="main-container">
    <div class="top-menu no-drag">
      <div class="toggle-fun">
        <ToggleGroup v-model:val="convertType" :funList="funList"></ToggleGroup>
      </div>
      <ToolBar class="fun-pane" :width="80" :funMenuList="funMenuList"></ToolBar>
    </div>
    <div class="split-panes">
      <splitpanes horizontal class="default-theme" style="height: 100%">
        <pane min-size="20" size="45">
          <TextArea v-model="data.textSourse" :maxlength="100000" :placeholder="`输入需要编码/解码的文本`"></TextArea>
        </pane>
        <pane min-size="30" size="53">
          <TextArea v-model="data.textTarget" :maxlength="100000" :placeholder="`转换后的文本`" :readonly="true"></TextArea>
        </pane>
      </splitpanes>
    </div>
  </div>
</template>

<script setup name="Base64Text">
import { ref, reactive, watch } from 'vue';
import { ToolBar } from '@/layout/components'
import { Splitpanes, Pane } from 'splitpanes'
import 'splitpanes/dist/splitpanes.css'
import { encodeToBase64, decodeFromBase64 } from '@/utils'
import { copyTextToClipboard } from '@/utils/download'
import ToggleGroup from '@/components/ToggleGroup/index.vue'
import TextArea from '@/components/TextArea/index.vue'
const convertType = ref('encode')
const data = reactive({
  textSourse: "",
  textTarget: ""
})

// 切换一次，内容也互换一次
watch(convertType, () => {
  const oldTextSourse = data.textSourse;
  const oldTextTarget = data.textTarget;
  data.textSourse = oldTextTarget
  data.textTarget = oldTextSourse
})

const funList = [
  {
    text: "编码",
    value: "encode"
  },
  {
    text: "解码",
    value: "decode"
  }
]

watch(data, (oldVal, newVal) => {
  if (convertType.value === "encode") {
    data.textTarget = encodeToBase64(newVal.textSourse)
  } else if (convertType.value === "decode") {
    data.textTarget = decodeFromBase64(newVal.textSourse)
  }
})

const funMenuList = [
  {
    menuName: '复制',
    menuIco: 'icon-copy',
    position: 'right',
    menuFun: () => {
      copyTextToClipboard(data.textTarget)
    }
  },
  {
    menuName: '清空',
    menuIco: 'icon-clean',
    position: 'right',
    menuFun: () => {
      data.textSourse = "";
      data.textTarget = "";
    }
  }
]
</script>

<style scoped lang="scss">
.main-container {
  width: 100%;
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
    // height: calc(100% - 43px);
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 0 10px 10px 10px;

    :deep(.splitpanes__splitter) {
      height: 15px;
      border-top: none;
      background-color: var(--main-background-color);
    }

    :deep(.splitpanes__pane) {
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
}
</style>