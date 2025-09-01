<template>
  <div class="url-parse-container">
    <div class="top-menu no-drag">
      <div class="toggle-fun">
        <ToggleGroup :funList="funList" v-model:val="selectVal"></ToggleGroup>
      </div>
      <ToolBar class="fun-pane" :width="80" :funMenuList="funMenuList"></ToolBar>
    </div>
    <div class="split-panes">
      <splitpanes horizontal class="default-theme">
        <pane min-size="20" size="30">
          <TextArea
            v-model="textSourse"
            :maxlength="10000"
            :placeholder="`请输入要解析的URL`"
          ></TextArea>
        </pane>
        <pane min-size="50" size="68">
          <template v-if="selectVal === 'json'">
            <div class="parse-result">
              <JsonPrettyViewer v-show="!isObjectEmpty(jsonObj)" :data="jsonObj" />
            </div>
          </template>
          <template v-else>
            <div class="parse-result">
              <el-table
                :data="tableObj"
                height="100%"
                max-height="360px"
                style="width: 100%"
                :border="true"
                size="small"
                :highlight-current-row="true"
                :stripe="true"
              >
                <el-table-column prop="id" label="ID" width="80" :sortable="true" />
                <el-table-column prop="key" label="键" width="140" :sortable="true" />
                <el-table-column prop="value" label="值" width="auto" :sortable="true" />
              </el-table>
            </div>
          </template>
        </pane>
      </splitpanes>
    </div>
  </div>
</template>

<script setup name="UrlParse">
import { ref, watch } from 'vue'
import { Splitpanes, Pane } from 'splitpanes'
import 'splitpanes/dist/splitpanes.css'
import { ToolBar } from '@/layout/components'
import ToggleGroup from '@/components/ToggleGroup/index.vue'
import TextArea from '@/components/TextArea/index.vue'
import JsonPrettyViewer from '@/components/JsonPrettyViewer/index.vue'
import { isObjectEmpty, parseUrlParams } from '@/utils'
import { copyTextToClipboard } from '@/utils/download'
import { Message } from '@/utils/message'

const textSourse = ref('')
const selectVal = ref('json')
const jsonObj = ref({})
const tableObj = ref([])

watch(textSourse, (val) => {
  try {
    const data = parseUrlParams(val)
    if (data) {
      jsonObj.value = data
      tableObj.value = convertToKeyValue(data)
    } else {
      jsonObj.value = {}
      tableObj.value = []
    }
  } catch (error) {
    Message({
      message: `${error.message}`,
      type: 'error'
    })
  }
})

const convertToKeyValue = (data) => {
  return Object.entries(data).map(([key, value], index) => ({ id: index + 1, key, value }))
}

const funList = [
  {
    text: 'JSON',
    value: 'json'
  },
  {
    text: '表格',
    value: 'table'
  }
]

const funMenuList = [
  {
    menuName: '复制',
    menuIco: 'icon-copy',
    position: 'right',
    menuFun: () => {
      if (selectVal.value === 'json') {
        copyTextToClipboard(JSON.stringify(jsonObj.value))
      } else {
        copyTextToClipboard(JSON.stringify(tableObj.value))
      }
    }
  },
  {
    menuName: '清空',
    menuIco: 'icon-clean',
    position: 'right',
    menuFun: () => {
      textSourse.value = ''
    }
  }
]
</script>

<style scoped lang="scss">
.url-parse-container {
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
    height: calc(100% - 46px);
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
      background-color: var(--main-background-color);
    }

    .parse-result {
      width: 100%;
      overflow: auto; /* 添加滚动条 */
      border: 1px dashed var(--main-dashed-border-color);
      border-radius: 5px;
      background-color: var(--main-background-color);
      padding: 5px;
    }
  }
}
</style>
