<template>
  <div class="win-operate-container no-drag" v-if="showWinBar">
    <div class="win-operate-pane">
      <!-- 置顶 -->
      <div
        v-if="showSetTop"
        :class="['iconfont icon-top', isTop ? 'win-top' : '']"
        @click="top"
      ></div>
      <!-- 最小化 -->
      <div v-if="showMin" class="iconfont icon-min" @click="minimize"></div>
      <!-- 最大化 -->
      <div
        v-if="showMax"
        :class="['iconfont', isMax ? 'icon-maximize' : 'icon-max']"
        @click="maximize"
      ></div>
      <!-- 关闭 -->
      <div v-if="showClose" class="iconfont icon-close" @click="close"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { isElectron } from '@/utils/electron'
import { editorPool } from '@/utils/EditorPool'


const props = defineProps({
  showSetTop: {
    type: Boolean,
    default: true
  },
  showMin: {
    type: Boolean,
    default: true
  },
  showMax: {
    type: Boolean,
    default: true
  },
  showClose: {
    type: Boolean,
    default: true
  },
  //关闭类型 0:关闭-最小化到托盘 1:退出
  closeType: {
    type: Number,
    default: 1
  }
})

// 根据环境决定是否显示窗口栏
const showWinBar = computed(() => isElectron())

const isMax = ref(false)
const isTop = ref(false)
onMounted(() => {
  isMax.value = false
  isTop.value = false
})

const winOp = (action, data) => {
  window.ipcRenderer.send('winTitleOp', { action, data })
}

const emit = defineEmits(['closeCallback', 'handelClickMenu'])
const close = () => {
  winOp('close', { closeType: props.closeType })
  emit('closeCallback')
  if(props.closeType === 1) {
    // 退出时，销毁所有编辑器和对象池中的对象
    editorPool.disposeAll()
  }
}

const minimize = () => {
  winOp('minimize')
}

const maximize = () => {
  if (isMax.value) {
    winOp('unmaximize')
    isMax.value = false
  } else {
    winOp('maximize')
    isMax.value = true
  }
}

const top = () => {
  isTop.value = !isTop.value
  winOp('top', { top: isTop.value })
}

</script>

<style lang="scss" scoped>
.win-operate-container {
  top: 0px;
  right: 0px;
  position: absolute;
  z-index: 1;
  overflow: hidden;
  border-radius: 0 3px 0 0;
  display: flex;
  flex-direction: row;

  .iconfont {
    float: left;
    font-size: 12px;
    text-align: center;
    display: flex;
    justify-content: center;
    cursor: pointer;
    height: 25px;
    align-items: center;
    padding: 0 10px;
    color: var(--main-win-btn-font-color);

    &:hover {
      background: var(--main-win-btn-active-color);
    }
  }

  .win-operate-pane {
    .icon-close {
      &:hover {
        background: var(--main-win-close-btn-active-color);
        color: var(--main-win-close-btn-active-font-color);
      }
    }

    .win-top {
      background: var(--main-win-top-active-color);
      color: var(--main-win-top-btn-color);
    }
  }
}
</style>
