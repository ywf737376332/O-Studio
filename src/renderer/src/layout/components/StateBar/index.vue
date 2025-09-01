<template>
  <div class="bottom-container">
    <div>
      <span><i>时间：</i>{{ currentTime }}</span>
      <span><i>作者：</i>莫斐鱼</span>
    </div>
    <div>
      <span v-show="!isEmpty(contentType)"><i>语言类型：</i>{{ contentType }}</span>
      <span v-show="!isEmpty(words) && words>0"><i>字数统计：</i>{{ words }} 词</span>
      <span v-show="mousePos?.line > 0">行 {{ mousePos.line }}，列 {{ mousePos.row }}</span>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { isEmpty, timesDiff } from '@/utils'
const props = defineProps({
  contentType: {
    type: String,
    default: ''
  },
  words: {
    type: Number,
    default: 0
  },
  mousePos: {
    type: Object,
    default: {}
  }
})
const currentTime = ref('')
let timerId
onMounted(() => {
  const startDate = Date.now()
  timerId = setInterval(() => {
    currentTime.value = timesDiff(startDate, Date.now())
  }, 1000)
})
onUnmounted(() => {
  clearInterval(timerId)
})
</script>

<style scoped lang="scss">
.bottom-container {
  // position: absolute;
  // bottom: 1.5px;
  // right: 0px;
  overflow: hidden;
  // width: calc(100% - 45px);
  width: 100%;
  height: 25px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
  border-top: 1px solid var(--main-border-color);
  background-color: var(--main-header-tagsview-background-color);
  span {
    font-size: 12px;
    color: var(--main-state-bar-font-color);
    margin-right: 18px;

    > i {
      font-style: normal;
      color: #999;
    }
  }

  > div:nth-child(1) {
    margin: 0 10px;
  }

  > div:nth-child(2) {
    flex: 1;
    display: flex;
    justify-content: flex-end;
    margin: 0 5px;

    > span:nth-child(1) {
      color: var(--main-state-bar-type-font-color);
    }
  }
}
</style>
