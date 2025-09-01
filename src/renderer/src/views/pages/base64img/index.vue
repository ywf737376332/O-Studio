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
          <TextArea v-model="dataModel.base64ImgSource" :maxlength="1000000"
            :placeholder="`请输入图片的Base64字符串`"></TextArea>
        </pane>
        <pane min-size="30" size="48">
          <DragUpload :imgSrc="dataModel.base64ImgSrc" :fileList="imageList" :operationTips="`拖入图片解码`"
            :fileTips="`文件类型支持：JPG、PNG，文件大小限制在5M以内。`" :showTools="true" @handleChange="handleChange" @clearImage="clearImage">
          </DragUpload>
        </pane>
      </splitpanes>
    </div>
  </div>
</template>

<script setup name="Base64Img">
import { ref, reactive, watch } from 'vue';
import { ToolBar } from '@/layout/components'
import { Splitpanes, Pane } from 'splitpanes'
import 'splitpanes/dist/splitpanes.css'
import { convertImgToBase64 } from '@/utils'
import { copyTextToClipboard, downloadBase64Img } from '@/utils/download'
import ToggleGroup from '@/components/ToggleGroup/index.vue'
import DragUpload from '@/components/DragUpload/index.vue'
import TextArea from '@/components/TextArea/index.vue'
const convertType = ref('data')

const dataModel = reactive({
  base64ImgSrcTmp: {
    data: '',
    origin: '',
    css: ''
  },
  base64ImgSource: '',
  base64ImgSrc: ''
})

const initBase64ImgSrcType = (base64) => {
  dataModel.base64ImgSrcTmp.data = base64;
  dataModel.base64ImgSrcTmp.origin = base64.split(',')[1];
  dataModel.base64ImgSrcTmp.css = "url(" + base64 + ")"
}

watch(() => dataModel.base64ImgSrcTmp, (newVal, oldVal) => {
  dataModel.base64ImgSrc = dataModel.base64ImgSrcTmp.data;
  switch (convertType.value) {
    case "data": {
      if (dataModel.base64ImgSrcTmp.data)
        dataModel.base64ImgSource = dataModel.base64ImgSrcTmp.data;
      break;
    }
    case "origin": {
      if (dataModel.base64ImgSrcTmp.origin)
        dataModel.base64ImgSource = dataModel.base64ImgSrcTmp.origin
      break;
    }
    case "css": {
      if (dataModel.base64ImgSrcTmp)
        dataModel.base64ImgSource = dataModel.base64ImgSrcTmp.css
      break;
    }
  }
}, { deep: true })

watch(() => dataModel.base64ImgSource, (newVal, oldVal) => {
  switch (convertType.value) {
    case "data": {
      if (dataModel.base64ImgSource) {
        dataModel.base64ImgSrc = dataModel.base64ImgSource;
      } else {
        dataModel.base64ImgSrc = ""
      }
      break;
    }
    case "origin": {
      if (dataModel.base64ImgSource) {
        dataModel.base64ImgSrc = "data:image/png;base64," + dataModel.base64ImgSource;
      } else {
        dataModel.base64ImgSrc = ""
      }
      break;
    }
    case "css": {
      if (dataModel.base64ImgSource) {
        let match = dataModel.base64ImgSource.match(/\((.*?)\)/);
        if (match && match[1]) {
          dataModel.base64ImgSrc = match[1];
        }
      } else {
        dataModel.base64ImgSrc = ""
      }
      break;
    }
  }
})

const imageList = ref([]);
const handleChange = (file, fileList) => {
  if (file) {
    convertImgToBase64(file.raw).then(base64 => {
      initBase64ImgSrcType(base64)
      imageList.value = fileList;
    })
  }
}

// 清空图片
const handleRemove = () => {
  imageList.value = []
  dataModel.base64ImgSrcTmp = {}
  dataModel.base64ImgSrc = "";
  dataModel.base64ImgSource = ""
}

const clearImage = () => {
  handleRemove()
}

// 切换模式
watch(convertType, () => {
  switch (convertType.value) {
    case "data": {
      if (dataModel.base64ImgSrcTmp)
        dataModel.base64ImgSource = dataModel.base64ImgSrcTmp.data;
      break;
    }
    case "origin": {
      if (dataModel.base64ImgSrcTmp)
        dataModel.base64ImgSource = dataModel.base64ImgSrcTmp.origin;
      break;
    }
    case "css": {
      if (dataModel.base64ImgSrcTmp)
        dataModel.base64ImgSource = dataModel.base64ImgSrcTmp.css
      break;
    }
  }
})

const funList = [
  {
    text: "原始",
    value: "origin"
  },
  {
    text: "数据",
    value: "data"
  },
  {
    text: "CSS",
    value: "css"
  }
]

const funMenuList = [
  {
    menuName: '清空',
    menuIco: 'icon-clean',
    position: 'left',
    menuFun: () => {
      handleRemove()
    }
  },
  {
    menuName: '复制串码',
    menuIco: 'icon-copy',
    position: 'right',
    menuFun: () => {
      copyTextToClipboard(dataModel.base64ImgSource)
    }
  },
  {
    menuName: '导出图片',
    menuIco: 'icon-download-img',
    position: 'right',
    menuFun: () => {
      downloadBase64Img(dataModel.base64ImgSrc)
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
    flex-direction: row;
    padding: 0 10px 10px 10px;

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
      border-top: none;
      border-left: none;
      background-color: var(--main-background-color);
    }
  }
}
</style>