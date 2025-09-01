<template>
  <PopoverPane
    :menuName="`语言设置`"
    :menuIco="`icon-language`"
    :width="250"
    :visible="visible"
    @handelClick="handelClick"
  >
    <template #container>
      <div class="popover-pane" ref="popoverPaneRef" v-click-outside="handleClickOutside">
        <div class="title">编辑器语言设置</div>
        <el-radio-group v-model="selectValue" @change="changeLanguage">
          <div class="content">
            <el-radio
              v-for="item in languageOptions"
              :key="item.value"
              :value="item.value"
              :label="item.label"
            />
          </div>
        </el-radio-group>
      </div>
    </template>
  </PopoverPane>
</template>

<script setup>
import { ref } from 'vue'
import PopoverPane from '@/components/PopoverPane/index.vue'
import { ClickOutside as vClickOutside } from 'element-plus' // 点击其他区域指令

const popoverPaneRef = ref(null)
const selectValue = ref('plaintext')

const visible = ref(false)
const handelClick = () => {
  visible.value = !visible.value
}

const emit = defineEmits(['changeLanguage', 'update:modelValue'])
const changeLanguage = (value) => {
  const label = getLanguageLabel(value)
  emit('update:modelValue', value)
  emit('changeLanguage', value, label)
  visible.value = false
}
const getLanguageLabel = (value) => {
  return languageOptions.find((item) => item.value === value)?.label
}

// 点击外部关闭
const handleClickOutside = (event) => {
  if (popoverPaneRef.value && !popoverPaneRef.value.contains(event.target)) {
    visible.value = false
  }
}

const languageOptions = [
  {
    value: 'json',
    label: 'Json'
  },
  {
    value: 'xml',
    label: 'Xml'
  },
  {
    value: 'sql',
    label: 'Sql'
  },
  {
    value: 'java',
    label: 'Java'
  },
  {
    value: 'html',
    label: 'Html'
  },
  {
    value: 'css',
    label: 'Css'
  },
  {
    value: 'javascript',
    label: 'JavaScript'
  },
  {
    value: 'typescript',
    label: 'TypeScript'
  },
  {
    value: 'plaintext',
    label: 'PlainText'
  },
  {
    value: 'yaml',
    label: 'Yaml'
  }
]

defineExpose({ getLanguageLabel })
</script>

<style scoped lang="scss">
.popover-pane {
  width: 100%;
  height: auto;
  border: 1px dashed var(--main-popover-border-color);
  border-radius: 3px;

  .title {
    width: 100%;
    padding: 5px;
    border-bottom: 1px dashed var(--main-popover-border-color);
    background-color: var(--main-popover-title-border-color);
    font-size: 13px;
  }

  .content {
    width: 98%;
    padding: 5px;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    align-items: center;
  }
}
</style>
