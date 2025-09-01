<template>
  <div style="width: 100%; height: 100%; position: relative">
    <el-input
      ref="textareaRef"
      v-model="inputVal"
      @input="inputChange"
      :maxlength="maxlength"
      :placeholder="placeholder"
      :show-word-limit="showWordLimit"
      type="textarea"
      autofocus
      class="sourse-area"
      resize="none"
      spellcheck="false"
      :readonly="readonly"
      @scroll="handleScroll"
    >
    </el-input>
    <div class="back-top-affix" @click="scrollPosTop" v-show="showBackTopAffix">
      <i class="iconfont icon-back-up"></i>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
const textareaRef = ref(null)
const inputVal = ref('')
const showBackTopAffix = ref(false)

const props = defineProps({
  modelValue: {
    type: [String, Number, Array],
    default: ''
  },
  maxlength: {
    type: Number,
    default: 100000
  },
  placeholder: {
    type: String,
    default: ''
  },
  showWordLimit: {
    type: Boolean,
    default: true
  },
  readonly: {
    type: Boolean,
    default: false
  }
})

watch(
  () => props.modelValue,
  (val) => {
    inputVal.value = val
  },
  { deep: true, immediate: true }
)

const emit = defineEmits(['update:modelValue'])
const inputChange = (modelValue) => {
  emit('update:modelValue', inputVal.value)
}
const handleScroll = (event) => {
  if (event.target.scrollTop > 50) {
    showBackTopAffix.value = true
  } else {
    showBackTopAffix.value = false
  }
}

/**
 * 滚动到最顶部
 */
const scrollPosTop = () => {
  textareaRef.value.$el.querySelector('textarea').scrollTop = 0
}
</script>

<style scoped lang="scss">
.back-top-affix {
  position: absolute;
  z-index: 999;
  right: 20px;
  bottom: 35px;
  width: 35px;
  height: 35px;
  line-height: 35px;
  text-align: center;
  cursor: pointer;
  border-radius: 50%;
  background-color: hsla(0, 0%, 0%, 0.3);
  color: #fff;

  &:hover {
    background-color: hsla(0, 0%, 0%, 0.5);
    font-weight: 800;
  }
}

:deep(.el-textarea__inner) {
  width: 100%;
  height: 99%;
  white-space: pre-wrap;
  /* 保持文本的换行 */
  word-wrap: break-word;
  /* 长单词或 URL 地址自动换行 */
  overflow-x: hidden;
  /* 禁用横向滚动条 */
}

:deep(.el-textarea .el-input__count) {
  bottom: 10px;
}
.el-textarea {
  width: 100%;
  height: 100%;
  background-color: var(--main-background-color);
}
</style>
