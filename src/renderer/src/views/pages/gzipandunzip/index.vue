<template>
  <div class="main-container">
    <div class="top-menu no-drag">
      <div class="toggle-fun">
        <ToggleGroup v-model:val="convertType" :funList="funList"></ToggleGroup>
      </div>
      <div class="compress-config-pane">
        <BaseSelect
          :label="`压缩算法`"
          v-model="compressType"
          :options="compressOpts"
          :width="80"
          @change="handleSelectChange"
        />
      </div>
      <div class="compress-config-pane">
        <BaseSelect
          :label="`编码格式`"
          v-model="outType"
          :options="outOpts"
          :width="80"
          @change="handleSelectChange"
        />
      </div>
      <ToolBar class="fun-pane" :width="80" :funMenuList="funMenuList"></ToolBar>
    </div>
    <div class="split-panes">
      <splitpanes horizontal class="default-theme" style="height: 100%">
        <pane min-size="20" size="45">
          <TextArea
            v-model="data.textSourse"
            :maxlength="100000"
            :placeholder="`输入需要压缩/解压缩的文本`"
          ></TextArea>
        </pane>
        <pane min-size="30" size="53">
          <TextArea
            v-model="data.textTarget"
            :maxlength="100000"
            :placeholder="`处理后的文本`"
            :readonly="true"
          ></TextArea>
        </pane>
      </splitpanes>
      <div class="tip">
        <p>
          压缩结果：原文本字节数：{{ compressResInfo.originalSize }}，压缩后字节数：{{
            compressResInfo.compressedSize
          }}，压缩率：{{ compressResInfo.compressionRatio }}%
        </p>
      </div>
    </div>
  </div>
</template>

<script setup name="GzipAndUnzip">
import { ref, reactive, watch } from 'vue'
import { ToolBar } from '@/layout/components'
import { Splitpanes, Pane } from 'splitpanes'
import 'splitpanes/dist/splitpanes.css'
import TextCompressor from '@/utils/TextCompressor'
import { copyTextToClipboard } from '@/utils/download'
import ToggleGroup from '@/components/ToggleGroup/index.vue'
import TextArea from '@/components/TextArea/index.vue'
import { Message } from '@/utils/message'
import BaseSelect from '@/components/BaseSelect/index.vue'

const convertType = ref('zip')
const data = reactive({
  textSourse: '',
  textTarget: ''
})

// 切换一次，内容也互换一次
watch(convertType, () => {
  const oldTextSourse = data.textSourse
  const oldTextTarget = data.textTarget
  data.textSourse = oldTextTarget
  data.textTarget = oldTextSourse
})

const handleSelectChange = (value) => {
  handelZipAndUnzip(data.textSourse, convertType.value)
}

const funList = [
  {
    text: '压缩',
    value: 'zip'
  },
  {
    text: '解压缩',
    value: 'unzip'
  }
]

watch(data, (value) => {
  if (convertType.value === 'zip') {
    handelZipAndUnzip(data.textSourse, convertType.value)
  } else if (convertType.value === 'unzip') {
    handelZipAndUnzip(data.textSourse, convertType.value)
  }
})

const compressResInfo = reactive({
  originalSize: 0,
  compressedSize: 0,
  compressionRatio: 0
})

const handelZipAndUnzip = (value, type) => {
  if (!value) return
  try {
    if (type === 'zip') {
      handelCompressState(value)
    } else if (type === 'unzip') {
      data.textTarget = TextCompressor.decompress(value, {
        type: compressType.value,
        inputFormat: outType.value
      })
    }
  } catch (error) {
    Message({
      message: `${error.message}`,
      type: 'error'
    })
  }
}

const handelCompressState = (value) => {
  const resultGzip = TextCompressor.compressWithStats(value, {
    type: compressType.value,
    outputFormat: outType.value
  })
  data.textTarget = resultGzip.result
  compressResInfo.originalSize = resultGzip.original.bytes
  compressResInfo.compressedSize = resultGzip.compressed.bytes
  compressResInfo.compressionRatio = resultGzip.compressionRatio
}

const resetObjectValues = () => {
  compressResInfo.originalSize = 0
  compressResInfo.compressedSize = 0
  compressResInfo.compressionRatio = 0
  data.textSourse = ''
  data.textTarget = ''
}

const compressType = ref('gzip')
const outType = ref('base64')
const compressOpts = [
  {
    value: 'gzip',
    label: 'Gzip'
  },
  {
    value: 'deflate',
    label: 'Deflate'
  }
  // Brotli
]
const outOpts = [
  {
    value: 'base64',
    label: 'Base64'
  },
  {
    value: 'hex',
    label: 'Hex'
  }
]

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
      resetObjectValues()
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

    .compress-config-pane {
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

    .tip {
      width: 100%;
      height: 20px;
      line-height: 20px;
      padding: 0 10px;
      border-radius: 3px;
      border: 1px dashed var(--main-tip-border-color);
      background-color: var(--main-tip-background-color);
      margin-top: 5px;

      p {
        font-size: 12px;
        color: #24ab44;
      }
    }
  }
}
</style>
