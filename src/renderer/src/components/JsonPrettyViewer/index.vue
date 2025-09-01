<template>
  <div class="json-pretty-container">
    <vue-json-pretty
      id="jsonViewer"
      :data="data"
      :editable="false"
      :showIcon="false"
      :showLineNumber="true"
      :showLine="true"
      :virtual="false"
      :showLength="true"
      :collapsedOnClickBrackets="true"
      :showDoubleQuotes="true"
      theme="light"
      :sort="true"
      @nodeClick="handleClick"
    />
  </div>
</template>

<script setup>
import VueJsonPretty from 'vue-json-pretty'
import 'vue-json-pretty/lib/styles.css'

defineProps({
  data: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['handleClick'])
const handleClick = (node) => {
  emit('handleClick', node)
}
</script>

<style scoped lang="scss">
.json-pretty-container {
  width: 100%;
  height: 100%;
  overflow: auto;

  :deep(.el-card__body) {
    background-color: var(--main-background-color);
  }

  /* 覆盖默认样式 */
  :deep(.vjs-key) {
    color: var(--json-key-color);
    /* 修改键的颜色 */
  }

  :deep(.vjs-value) {
    color: var(--json-value-color);
    /* 修改值的颜色 */
  }

  :deep(.vjs-value-string) {
    color: var(--json-value-string-color);
    /* 修改字符串的颜色 */
  }

  :deep(.vjs-value-number) {
    color: var(--json-value-number-color);
    /* 修改数字的颜色 */
  }

  :deep(.vjs-value-boolean) {
    color: var(--json-value-boolean-color);
    /* 修改布尔值的颜色 */
  }

  :deep(.vjs-value-null, .vjs-value-undefined) {
    color: var(--json-value-other-color);
    /* 修改 null 的颜色 */
  }
  :deep(.vjs-tree-brackets) {
    color: var(--json-value-brackets-color);
    /* 修改 {} 的颜色 */
  }
}
</style>
