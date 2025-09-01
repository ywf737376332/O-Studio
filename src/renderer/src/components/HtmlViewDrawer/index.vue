<template>
  <!-- 右侧展开抽屉 -->
  <DrawerViewer :showDrawer="showDrawer" :title="`代码预览`" :withHeader="true" :showClose="true" :size="100"
    @handleClose="handleClose">
    <template #main>
      <div class="code-container">
        <pre><code v-html="htmlCode"></code></pre>
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
import { ref } from 'vue'
import { Message } from '@/utils/message'
import {
  handelMainCallBack,
  copyImageToClipboard,
  copyTextToClipboard,
  downloadImageToFile
} from '@/utils/download'
import DrawerViewer from '@/components/DrawerViewer/index.vue'
import QrcodeDialog from '@/components/QrcodeDialog/index.vue'
import { isElectron } from '@/utils/electron'
import { generateQRCodeToSvg } from '@/utils/qrcodeTools'

const props = defineProps({
  showDrawer: {
    type: Boolean,
    default: true
  },
  htmlCode: {
    type: String,
    required: true
  },
  textCode: {
    type: String,
    default: ''
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

const downloadImg = async () => {
  const dom = document.querySelector('.code-container')
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
      downloadTextToFile(props.textCode)
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
      copyTextToClipboard(props.textCode)
    }
  },
  {
    menuName: '复制图片',
    menuIco: 'icon-screen-share',
    disabled: false,
    menuFun: async () => {
      const dom = document.querySelector('.code-container')
      await copyImageToClipboard(dom, { width: dom.scrollWidth, height: dom.scrollHeight })
    }
  },
  {
    menuName: '二维码分享',
    menuIco: 'icon-share-qrcode',
    disabled: false,
    menuFun: () => {
      generateQRCodeToSvg(props.textCode, { width: 430 }).then((res) => {
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
.code-container {
  width: 100%;
  height: 100%;
  padding: 10px 20px;
}

.footer-func {
  padding: 0 20px;
}

:deep(pre) {
  border-radius: 4px;
  overflow: auto;
}

:deep(code) {
  font-family: Consolas, Monaco, 'Courier New', monospace;
  font-size: 14px;
  line-height: 1.5;
  white-space: pre;
  tab-size: 4;
  /* 设置 tab 的大小 */
  -moz-tab-size: 4;
  white-space: pre-wrap;
  /* 保持换行和空格 */
  word-break: normal;
  /* 使用正常的断词规则 */
  word-wrap: break-word;
  /* 允许长单词换行 */
}

/* 保持缩进的空格 */
:deep(code span) {
  white-space: pre-wrap;
}

/* 暗色主题 */
:deep(.vs-dark pre) {
  background-color: #1e1e1e;
  color: #d4d4d4;
}

/* 亮色主题 */
:deep(.vs pre) {
  background-color: #ffffff;
  color: #000000;
  border: 1px solid #e0e0e0;
}
</style>
