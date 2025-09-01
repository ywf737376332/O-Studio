<template>
  <div class="main-container">
    <div class="top-menu drag">
      <ToolBar :funMenuList="funMenuList"></ToolBar>
    </div>
    <div class="qrcode-generate-panes">
      <div class="qrcode-text-area">
        <TextArea
          v-model="dataModel.base64QrcodeText"
          :maxlength="8000"
          :placeholder="`请输入二维码内容`"
        ></TextArea>
      </div>
      <div class="qrcode-container">
        <DragUpload
          class="qrcode-view"
          :imgSrc="dataModel.base64QrcodeImgSrc"
          :fileList="imageList"
          :operationTips="`拖入二维码解析`"
          :showTools="true"
          @handleChange="handleChange"
          @clearImage="clearImage"
        />
        <QrcodeTools
          ref="qrcodeConfigRef"
          v-model="dataModel.qrcodeConfig"
          :qrcodeText="dataModel.base64QrcodeText"
        />
      </div>
    </div>
  </div>
</template>

<script setup name="QrcodeView">
import { ref, reactive, watch } from 'vue'
import { ToolBar } from '@/layout/components'
import { Splitpanes, Pane } from 'splitpanes'
import 'splitpanes/dist/splitpanes.css'
import { isEmpty, convertImgToBase64 } from '@/utils'
import { copyBase64ImageToClipboard, downloadBase64Img } from '@/utils/download'
import {
  generateQRCodeToSvg,
  generateQRCodeWithLogoSVG,
  svgImgToBase64,
  decodeQRCode
} from '@/utils/qrcodeTools'
import DragUpload from '@/components/DragUpload/index.vue'
import TextArea from '@/components/TextArea/index.vue'
import { Message } from '@/utils/message'
import QrcodeTools from '@/components/QrcodeTools/index.vue'

const dataModel = reactive({
  base64QrcodeText: '',
  base64QrcodeImgSrc: '',
  qrcodeConfig: {}
})

watch(
  () => dataModel.base64QrcodeText,
  async (qrcodeText) => {
    dataModel.base64QrcodeImgSrc = await getQRCodeBase64Img(qrcodeText)
  }
)

watch(
  () => dataModel.qrcodeConfig,
  async () => {
    dataModel.base64QrcodeImgSrc = await getQRCodeBase64Img(dataModel.base64QrcodeText)
  },
  { deep: true }
)

const getQRCodeBase64Img = async (qrcodeText) => {
  const {
    foreground,
    background,
    errorLevel,
    margin,
    logoUrl,
    logoSize,
    borderWidth,
    borderRadius
  } = dataModel.qrcodeConfig
  try {
    if (isEmpty(logoUrl)) {
      const qRCodeBase64Img = await generateQRCodeToSvg(qrcodeText, {
        width: 630,
        color: {
          dark: foreground, // 前景色（二维码颜色）
          light: background // 背景色
        },
        errorCorrectionLevel: errorLevel,
        margin: margin
      })
      return svgImgToBase64(qRCodeBase64Img)
    } else {
      const qRCodeBase64Img = await generateQRCodeWithLogoSVG(
        qrcodeText,
        {
          url: logoUrl,
          size: logoSize,
          borderWidth: borderWidth,
          borderRadius: borderRadius
        },
        {
          width: 630,
          color: {
            dark: foreground, // 前景色（二维码颜色）
            light: background // 背景色
          },
          errorCorrectionLevel: errorLevel,
          margin: margin
        }
      )
      return svgImgToBase64(qRCodeBase64Img)
    }
  } catch (error) {
    Message({
      message: `二维码生成失败：${error.message}`,
      type: 'error'
    })
  }
}

const getQRCodeText = (base64ImgUrl) => {
  return decodeQRCode(base64ImgUrl)
    .then((res) => {
      dataModel.base64QrcodeText = res
    })
    .catch((error) => {
      dataModel.base64QrcodeImgSrc = ''
      Message({
        message: `错误提醒：${error.message}`,
        type: 'error'
      })
    })
}

const qrcodeConfigRef = ref(null)
const imageList = ref([])

const handleChange = (file, fileList) => {
  if (file) {
    convertImgToBase64(file.raw)
      .then((base64) => {
        getQRCodeText(base64)
        dataModel.base64QrcodeImgSrc = base64
        imageList.value = fileList
      })
      .catch((error) => {
        Message({
          message: '图片上传失败' + error,
          type: 'error'
        })
      })
  }
}

// 清空内容
const clearImage = () => {
  imageList.value = []
  dataModel.base64QrcodeImgSrc = ''
  dataModel.base64QrcodeText = ''
}

const funMenuList = [
  {
    menuName: '清空内容',
    menuIco: 'icon-clean',
    position: 'right',
    menuFun: () => {
      clearImage()
    }
  },
  {
    menuName: '清除美化',
    menuIco: 'icon-copy',
    position: 'right',
    menuFun: () => {
      qrcodeConfigRef.value.resetQrcodeConfig()
    }
  },
  {
    menuName: '复制图片',
    menuIco: 'icon-copy',
    position: 'right',
    menuFun: () => {
      copyBase64ImageToClipboard(dataModel.base64QrcodeImgSrc)
    }
  },
  {
    menuName: '下载图片',
    menuIco: 'icon-copy',
    position: 'right',
    menuFun: () => {
      downloadBase64Img(dataModel.base64QrcodeImgSrc)
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

  .qrcode-generate-panes {
    width: 100%;
    flex: 1;
    display: flex;
    flex-direction: row;
    justify-content: center;
    padding: 0 10px 10px 10px;

    .qrcode-text-area {
      display: flex;
      flex-direction: row;
      justify-content: center;
      flex: 1;
    }

    .qrcode-container {
      width: 100%;
      height: 100%;
      max-width: 460px;
      display: flex;
      flex-direction: column;
      padding: 0px 10px;
      font-size: 12px;
      align-self: flex-end;
      padding-bottom: 5px;

      .qrcode-view {
        width: 100%;
        flex: 1;
      }
    }
  }
}
</style>
