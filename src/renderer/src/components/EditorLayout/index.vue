<template>
  <div class="editor-container">
    <div ref="container" class="split-container">
      <!-- 动态渲染编辑器分栏 -->
      <EditorColumn
        v-for="(editor, index) in editors"
        :key="editor.id"
        :ref="setColumnRef"
        :language="editor.language"
        @close="removeColumn(index)"
      />

      <!-- 添加按钮 -->
      <div class="add-column">
        <button @click="addColumn">+ Add Column</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
import Split from 'split.js'
import EditorColumn from '@/components/EditorColumn/index.vue'

// 编辑器实例管理
const editors = ref([
  { id: Date.now(), content: '// First Editor', language: 'javascript' }
])

// 分栏容器引用
const container = ref(null)
const columnRefs = ref([])
const splitInstance = ref(null)

// 初始化分栏布局
const initSplit = () => {
  if (columnRefs.value.length > 1) {
    splitInstance.value = Split(columnRefs.value.map(el => el.$el), {
      sizes: Array(columnRefs.value.length).fill(100 / columnRefs.value.length),
      minSize: 200,
      gutterSize: 8,
      snapOffset: 0
    })
  }
}

// 添加新分栏
const addColumn = () => {
  editors.value.push({
    id: Date.now(),
    content: `// New Editor ${editors.value.length + 1}`,
    language: 'javascript'
  })
  
  nextTick(() => {
    destroySplit()
    initSplit()
  })
}

// 移除分栏
const removeColumn = (index) => {
  if (editors.value.length <= 1) return
  editors.value.splice(index, 1)
  
  nextTick(() => {
    destroySplit()
    initSplit()
  })
}

// 销毁分割实例
const destroySplit = () => {
  if (splitInstance.value) {
    splitInstance.value.destroy()
    splitInstance.value = null
  }
}

// 收集分栏引用
const setColumnRef = (el) => {
  if (el) columnRefs.value.push(el)
}

// 内容更新
const updateContent = (index, value) => {
  editors.value[index].content = value
}

// 生命周期管理
onMounted(() => initSplit())
onBeforeUnmount(() => destroySplit())
</script>

<style>
.editor-container {
  width: 100%;
  height: 100vh;
}

.split-container {
  display: flex;
  width: 100%;
  height: 100%;
}

.gutter {
  background-color: #eee;
  background-repeat: no-repeat;
  background-position: 50%;
  transition: background-color 0.3s;
}

.gutter:hover {
  background-color: #999;
}

.add-column {
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 100px;
}

button {
  padding: 8px 16px;
  background: #007acc;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>