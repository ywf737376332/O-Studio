<template>
  <div class="editor-column">
    <div class="editor-header">
      <button>×</button>
    </div>
    <div ref="editorContainer" class="editor"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import * as monaco from 'monaco-editor'

const props = defineProps({
  // modelContext: String,
  language: String
})

//const emit = defineEmits(['update:modelContext', 'close'])

// Editor实例
let editor = null
const editorContainer = ref(null)

// 初始化编辑器
onMounted(() => {
  editor = monaco.editor.create(editorContainer.value, {
    value: "",
    language: props.language,
    theme: 'vs-dark',
    minimap: {
      enabled: true
    },
    automaticLayout: true
  })

  // 监听内容变化
  editor.onDidChangeModelContent(() => {
    //emit('update:modelContext', editor.getValue())
  })
})

// 更新语言
const updateLanguage = () => {
  monaco.editor.setModelLanguage(editor.getModel(), props.language)
}

// 销毁实例
onBeforeUnmount(() => {
  if (editor) {
    editor.dispose()
  }
})

// 响应外部内容变化
// watch(() => props.modelContext, (newVal) => {
//   if (newVal !== editor.getValue()) {
//     editor.setValue(newVal)
//   }
// })
</script>

<style>
.editor-column {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.editor-header {
  background: #1e1e1e;
  padding: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.editor-header select {
  background: #333;
  color: white;
  border: 1px solid #666;
  padding: 4px;
}

.editor-header button {
  background: transparent;
  border: none;
  color: white;
  cursor: pointer;
  font-size: 18px;
}

.editor {
  flex: 1;
  overflow: hidden;
}
</style>