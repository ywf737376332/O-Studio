<template>
  <div class="qrcode-config-container">
    <div class="qrcode-config-pane">
      <div class="fun-item">
        <span class="item-label">容错率</span>
        <el-select
          v-model="qrcodeConfig.errorLevel"
          placeholder="请选择错误修正级别"
          size="small"
          style="width: 90%; padding-right: 10px"
        >
          <el-option
            v-for="item in errorRateOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
      <div class="fun-item">
        <span class="item-label" style="margin-right: 2px">边距大小</span>
        <el-slider v-model="qrcodeConfig.margin" :min="1" :max="10" />
      </div>
    </div>
    <div class="qrcode-logo-color-pane">
      <div class="logo-color-pane">
        <div class="fun-item">
          <span class="item-label">背景色</span>
          <el-color-picker
            v-model="qrcodeConfig.background"
            show-alpha
            color-format="hex"
            :predefine="predefineColors"
            size="small"
            class="full-width-picker"
          />
        </div>
        <div class="fun-item">
          <span class="item-label">前景色</span>
          <el-color-picker
            v-model="qrcodeConfig.foreground"
            show-alpha
            color-format="hex"
            :predefine="predefineColors"
            size="small"
            class="full-width-picker"
          />
        </div>
      </div>
      <DragUpload
        class="upload-logo-pane"
        :imgSrc="qrcodeConfig.logoUrl"
        :fileList="imageList"
        :operationTips="`Logo`"
        :showTools="false"
        @handleChange="handleChange"
        @clearImage="resetQrcodeConfig"
      />
    </div>
    <div class="qrcode-logo-size-pane">
      <div class="fun-item">
        <span class="item-label">Logo尺寸</span>
        <el-input-number
          style="width: 100px; margin-right: 10px"
          controls-position="right"
          v-model="qrcodeConfig.logoSize"
          :min="1"
          :max="20"
          size="small"
        >
          <template #suffix>
            <span>%</span>
          </template>
        </el-input-number>
        <el-input-number
          style="width: 100px; margin-right: 10px"
          controls-position="right"
          v-model="qrcodeConfig.borderWidth"
          :step="5"
          :min="1"
          :max="100"
          size="small"
        >
          <template #suffix>
            <span>px</span>
          </template>
        </el-input-number>
        <el-input-number
          style="width: 100px; margin-right: 10px"
          controls-position="right"
          v-model="qrcodeConfig.borderRadius"
          :step="10"
          :min="1"
          :max="100"
          size="small"
        >
          <template #suffix>
            <span>px</span>
          </template>
        </el-input-number>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'
import { convertImgToBase64 } from '@/utils'
import DragUpload from '@/components/DragUpload/index.vue'
import { Message } from '@/utils/message'

const defaultQRCodeConfig = {
  errorLevel: 'M',
  margin: 1,
  background: '#FFFFFF',
  foreground: '#000000',
  bImageSrc: '',
  fImageSrc: '',
  logoUrl: '',
  logoSize: 20,
  borderWidth: 10,
  borderRadius: 10
}

const qrcodeConfig = reactive({ ...defaultQRCodeConfig })

const emit = defineEmits(['update:modelValue'])
watch(
  qrcodeConfig,
  (value) => {
    emit('update:modelValue', value)
  },
  { deep: true }
)

const resetQrcodeConfig = () => {
  Object.keys(defaultQRCodeConfig).forEach((key) => {
    qrcodeConfig[key] = defaultQRCodeConfig[key]
  })
}

const predefineColors = ref([
  '#ff4500',
  '#ff8c00',
  '#ffd700',
  '#90ee90',
  '#00ced1',
  '#1e90ff',
  '#c71585'
])

const errorRateOptions = [
  {
    value: 'L',
    label: '低(7%)'
  },
  {
    value: 'M',
    label: '中(15%)'
  },
  {
    value: 'Q',
    label: '四分之一(25%)'
  },
  {
    value: 'H',
    label: '高(30%)'
  }
]

const imageList = ref([])
const handleChange = (file, fileList) => {
  if (file) {
    convertImgToBase64(file.raw)
      .then((base64) => {
        qrcodeConfig.logoUrl = base64
        imageList.value = fileList
      })
      .catch((error) => {
        Message({
          message: 'Logo上传失败' + error,
          type: 'error'
        })
      })
  }
}

defineExpose({ resetQrcodeConfig, defaultQRCodeConfig })
</script>

<style scoped lang="scss">
.qrcode-config-container {
  width: 100%;
  height: 210px;
  padding: 10px 5px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-content: space-between;
  border: 1px dashed #666;
  padding: 10px 15px;
  margin: 10px 10px 0 0;
  border-radius: 3px;
  overflow: hidden;

  .qrcode-config-pane {
    display: flex;
    flex-direction: column;
  }

  .qrcode-logo-color-pane {
    min-width: 40px;
    height: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;

    .logo-color-pane {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }

    .upload-logo-pane {
      width: 80px;
      height: 80px;
      margin-right: 10px;
    }
  }

  .qrcode-logo-size-pane {
    display: flex;
    flex-direction: column;
    padding: 10px 0;
  }

  .fun-item {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;

    .item-label {
      min-width: 75px;
      line-height: 32px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      margin-bottom: 0;
      margin-left: 5px;

      &::after {
        content: '：';
      }
    }
  }

  .fun-item:not(:last-of-type) {
    margin-bottom: 3px;
  }
}

/**滑动条样式 */
:deep(.el-slider) {
  width: 90%;
  padding-right: 10px;
}

:deep(.el-slider__runway) {
  height: 3px;
}

:deep(.el-slider__bar) {
  height: 3px;
}

:deep(.el-slider__button) {
  width: 15px;
  height: 15px;
  transform: translateY(-10%);
}

/** 颜色选择器样式 */
:deep(.el-color-picker__trigger) {
  height: 24px;
  min-width: 210px;
  margin-right: 10px;
}
</style>
