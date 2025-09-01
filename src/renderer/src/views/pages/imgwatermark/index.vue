<template>
  <div class="main-container">
    <div class="top-menu no-drag">
      <div class="toggle-fun">
        <ToggleGroup v-model:val="optsType" :funList="funList"></ToggleGroup>
      </div>
      <ToolBar class="fun-pane" :width="80" :funMenuList="funMenuList"></ToolBar>
    </div>
    <div class="split-panes">
      <splitpanes class="default-theme" style="height: 100%">
        <pane min-size="40" size="60">
          <WatermarkImgDragUpload :imgSrc="base64ImgSrc" :fileList="imageList" :optsType="optsType"
            :watermarkOps="watermarkOps" @handleChange="handleChange" @clearImage="clearImage">
          </WatermarkImgDragUpload>
        </pane>
        <pane min-size="20" size="40">
          <div class="setting-container">
            <ImgWatermarkTools ref="imgWatermarkToolsRef" v-model:options="watermarkOps" :optsType="optsType">
            </ImgWatermarkTools>
          </div>
        </pane>
      </splitpanes>
    </div>
  </div>
</template>

<script setup name="ImgWaterMark">
import { ref, watch } from 'vue';
import { ToolBar } from '@/layout/components'
import { Splitpanes, Pane } from 'splitpanes'
import 'splitpanes/dist/splitpanes.css'
import { convertImgToBase64 } from '@/utils'
import { copyImageToClipboard, downloadImageToFile, downloadBase64Img } from '@/utils/download'
import ToggleGroup from '@/components/ToggleGroup/index.vue'
import ImgWatermarkTools from '@/components/ImgWatermarkTools/index.vue'
import WatermarkImgDragUpload from '@/components/WatermarkImgDragUpload/index.vue'
import { isElectron } from '@/utils/electron'

const optsType = ref('text')
const imgWatermarkToolsRef = ref(null)
const watermarkOps = ref({
  content: '',
  color: '',
  font: {
    fontSize: 16,
    color: '',
  },
  rotate: -22,
  gap: [20, 20],
  offset: [0, 0],
  watermarkImg: {
    url: '',
    width: 0,
    height: 0
  }
})

watch(watermarkOps, (newVal) => {
  if (optsType.value === 'image') {
    Logger.info('父组件检测到变化：')
  }
}, { deep: true });

const base64ImgSrc = ref('')
const imageList = ref([]);
const handleChange = (file, fileList) => {
  if (file) {
    convertImgToBase64(file.raw).then(base64 => {
      base64ImgSrc.value = base64;
      imageList.value = fileList;
    })
  }
}

// 清空图片
const handleRemove = () => {
  imageList.value = []
  base64ImgSrc.value = "";
  imgWatermarkToolsRef.value.clearWatemarkImage()
}

const clearImage = () => {
  handleRemove()
}

const funList = [
  {
    text: "文字水印",
    value: "text"
  },
  {
    text: "图片水印",
    value: "image"
  }
]
const funMenuList = [
  {
    menuName: '清空',
    menuIco: 'icon-clean',
    position: 'right',
    menuFun: () => {
      handleRemove()
    }
  },
  {
    menuName: '复制',
    menuIco: 'icon-copy',
    position: 'right',
    menuFun: () => {
      const dom = document.querySelector('.img-watermark')
      copyImageToClipboard(dom, { width: dom.scrollWidth, height: dom.scrollHeight })
    }
  },
  {
    menuName: '导出',
    menuIco: 'icon-download-img',
    position: 'right',
    menuFun: async () => {
      const dom = document.querySelector('.img-watermark')
      await downloadImageToFile(dom, { width: dom.scrollWidth, height: dom.scrollHeight })
        .then(canvas => {
          const base64Url = canvas.toDataURL('image/png', 1.0);
          downloadBase64Img(base64Url);
        }).catch(error => {
          Message({
            message: '图片下载失败！' + error,
            type: 'error'
          })
        })
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

    .img-watermark {
      width: 100%;
      height: 100%;
    }

    .setting-container {
      width: 100%;
      height: 100%;
      border: 1px dashed var(--main-dashed-border-color);
      border-radius: 5px;
      padding: 10px 10px;
    }

    :deep(.splitpanes__pane) {
      display: flex;
      justify-content: center;
      align-items: center;
    }

    :deep(.splitpanes.default-theme .splitpanes__pane) {
      background-color: #FFF;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      background-color: var(--main-background-color);
    }

    :deep(.splitpanes__splitter) {
      border-left: none;
      background-color: var(--main-background-color);
    }

    :deep(.el-upload-dragger) {
      width: 99%;
    }
  }
}
</style>