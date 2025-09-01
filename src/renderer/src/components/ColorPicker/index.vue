<template>
  <div class="color-picker-container" v-click-outside="handleClickOutside">
    <!-- 触发区域 -->
    <div ref="trigger" class="color-trigger" :style="{ backgroundColor: modelValue }" @click="togglePicker"></div>
    <!-- 颜色选择弹出层 -->
    <teleport to="body">
      <div v-show="showPicker" class="color-picker-popup" ref="popup">
        <div class="color-grid" :style="popupStyle">
          <div v-for="(color, index) in colors" :key="index" class="color-item" :style="{
            backgroundColor: color,
            width: blockSize + 'px',
            height: blockSize + 'px'
          }" @click.stop="selectColor(color)"></div>
        </div>
      </div>
    </teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { ClickOutside as vClickOutside } from 'element-plus' // 点击其他区域指令
const props = defineProps({
  colors: {
    type: Array,
    default: () => [
      '#409EFF',
      '#67C23A',
      '#E6A23C',
      '#FFFFFF',
      '#000000'
    ]
  },
  modelValue: {
    type: String,
    default: '#409EFF'
  },
  blockSize: {
    type: Number,
    default: 25
  },
  columns: {
    type: Number,
    default: 5
  }
})

const emit = defineEmits(['update:modelValue', 'change'])

const showPicker = ref(false)
const trigger = ref(null)
const popup = ref(null)

// 计算弹出层位置
const popupStyle = computed(() => {
  const gridColumns = props.colors.length < props.columns ? props.colors.length : props.columns;
  return {
    'grid-template-columns': `repeat(${gridColumns}, 1fr)`
  }
})

// 切换选择器显示
const togglePicker = async () => {
  showPicker.value = !showPicker.value
  if (showPicker.value) {
    await nextTick()
    adjustPosition()
  }
}

// 选择颜色
const selectColor = (color) => {
  showPicker.value = false
  emit('update:modelValue', color)
  emit('change', color)
}

// 调整弹出层位置
const adjustPosition = () => {
  if (!trigger.value || !popup.value) return

  const triggerRect = trigger.value.getBoundingClientRect()
  const popupRect = popup.value.getBoundingClientRect()
  const viewportWidth = window.innerWidth
  const viewportHeight = window.innerHeight

  // 基础定位
  let left = triggerRect.left
  let top = triggerRect.top + triggerRect.height + 8

  // 横向边界检测
  if (left + popupRect.width > viewportWidth) {
    left = viewportWidth - popupRect.width - 8
  }

  // 纵向边界检测
  if (top + popupRect.height > viewportHeight) {
    top = triggerRect.top - popupRect.height - 8
  }

  // 应用定位
  popup.value.style.left = `${left}px`
  popup.value.style.top = `${top}px`
}

// 点击外部关闭
const handleClickOutside = (event) => {
  if (popup.value && !popup.value.contains(event.target) && !trigger.value.contains(event.target)) {
    showPicker.value = false
  }
}

// 生命周期钩子
onMounted(() => {
  window.addEventListener('resize', adjustPosition)
})

onUnmounted(() => {
  window.removeEventListener('resize', adjustPosition)
})
</script>

<style scoped>
.color-picker-container {
  display: inline-block;
  position: relative;
  border: 1px solid var(--main-color-pick-border-color);
  border-radius: 4px;
  padding: 4px 4px;
}

.color-picker-container:hover {
  border: 1px solid #999;
}

.color-trigger {
  min-width: 30px;
  height: 18px;
  line-height: 20px;
  border: 1px solid var(--main-border-color);
  border-radius: 2px;
  cursor: pointer;
  transition: all 0.2s;
}

.color-trigger:hover {
  transform: scale(1.05);
}

.color-picker-popup {
  position: fixed;
  background: var(--main-background-color);
  border: 1px solid var(--main-border-color);
  border-radius: 8px;
  padding: 10px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
  z-index: 9999;
}

.color-grid {
  display: grid;
  gap: 8px;
}

.color-item {
  cursor: pointer;
  border-radius: 4px;
  border: 1px solid var(--main-border-color);
  transition: all 0.2s;
}

.color-item:hover {
  transform: scale(1.1);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
}
</style>
