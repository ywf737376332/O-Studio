<template>
  <!-- 右侧展开抽屉 -->
  <DrawerViewer :showDrawer="showDrawer" :title="`JSON视图`" :withHeader="true" :showClose="true" :size="100"
    @handleClose="handleClose">
    <template #main>
      <div class="drawer-container">
        <JsonFuncViewer :data="jsonObj" />
      </div>
      <QrcodeDialog :visible="dialogVisible" :qrcodeText="qrcodeText" @dialogCloseCall="dialogClose"></QrcodeDialog>
    </template>
    <template #bottom>
      <div class="footer-func">
        <template v-for="item in funBtnList">
          <el-button size="small" :disabled="item.disabled" plain @click="item.menuFun()">
            {{ item.menuName }}
            <template #icon>
              <div :class="['iconfont', item.menuIco]"></div>
            </template>
          </el-button>
        </template>
      </div>
    </template>
  </DrawerViewer>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Message, Notification } from '@/utils/message'
import { isEmpty } from '@/utils'
import { formatJson } from '@/utils/beautifyJson'
import { handelMainCallBack, copyImageToClipboard, copyTextToClipboard, downloadImageToFile } from '@/utils/download'
import DrawerViewer from '@/components/DrawerViewer/index.vue'
import JsonFuncViewer from '@/components/JsonFuncViewer/index.vue'
import { isElectron } from '@/utils/electron'
import QrcodeDialog from '@/components/QrcodeDialog/index.vue'
import { generateQRCodeToSvg } from '@/utils/qrcodeTools'

const props = defineProps({
  showDrawer: {
    type: Boolean,
    default: true
  },
  jsonText: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['handleClose'])
const handleClose = () => {
  emit('handleClose')
}

const dialogVisible = ref(false)
const qrcodeText = ref('')
// 二维码对话框关闭回调
const dialogClose = () => {
  dialogVisible.value = false
}

const jsonObj = computed(() => {
  //计算属性传递参数
  if (isEmpty(props.jsonText)) {
    return
  }
  let obj = { code: 500, message: '数据解析失败' }
  try {
    obj = JSON.parse(props.jsonText)
  } catch (e) {
    Notification({
      title: '解析错误提示',
      message: 'JSON结构解析失败，请检查！'
    })
  }
  return obj
})

const downloadImg = async () => {
  const dom = document.getElementById('jsonViewer')
  dom.style.padding = '10px 20px'
  await downloadImageToFile(dom, { width: dom.scrollWidth, height: dom.scrollHeight })
    .then((canvas) => {
      const base64Url = canvas.toDataURL('image/png', 1.0)
      if (isElectron()) {
        handelMainCallBack('exportImageToFile', base64Url)
          .then((res) => {
            if (res && res.success) {
              Message({
                message: '图片导出成功！',
                type: 'success'
              })
            }
          })
          .catch(() => {
            Message({
              message: '图片导出失败！',
              type: 'error'
            })
          })
      }
    })
    .catch((error) => {
      Message({
        message: '图片下载失败！' + error,
        type: 'error'
      })
    })
}

const downloadTextToFile = (textToCopy) => {
  if (textToCopy && isElectron()) {
    handelMainCallBack('exportTextToFile', textToCopy)
      .then((res) => {
        if (res && res.success) {
          Message({
            message: '文件导出成功！',
            type: 'success'
          })
        }
      })
      .catch(() => {
        Message({
          message: '文件导出失败！',
          type: 'error'
        })
      })
  }
}

const funBtnList = [
  {
    menuName: '导出文件',
    menuIco: 'icon-download-text',
    disabled: false,
    menuFun: () => {
      downloadTextToFile(formatJson(props.jsonText))
    }
  },
  {
    menuName: '导出图片',
    menuIco: 'icon-download-img',
    disabled: false,
    menuFun: () => {
      downloadImg()
    }
  },
  {
    menuName: '复制文本',
    menuIco: 'icon-copy',
    disabled: false,
    menuFun: () => {
      copyTextToClipboard(formatJson(props.jsonText))
    }
  },
  {
    menuName: '复制图片',
    menuIco: 'icon-screen-share',
    disabled: false,
    menuFun: () => {
      const dom = document.getElementById('jsonViewer')
      dom.style.padding = '10px 20px'
      copyImageToClipboard(dom, { width: dom.scrollWidth, height: dom.scrollHeight })
    }
  },
  {
    menuName: '二维码分享',
    menuIco: 'icon-share-qrcode',
    disabled: false,
    menuFun: () => {
      generateQRCodeToSvg(props.jsonText, { width: 430 }).then((res) => {
        qrcodeText.value = res;
        dialogVisible.value = true
      }).catch((err) => {
        Message({
          message: `二维码生成失败！</br></br>${err.message}`,
          type: 'error'
        })
        dialogVisible.value = false
      })
    }
  }
]
</script>

<style scoped lang="scss">
.drawer-container {
  width: 100%;
  height: 100%;
  overflow: auto;
}

.footer-func {
  padding: 0 20px;
}
</style>
