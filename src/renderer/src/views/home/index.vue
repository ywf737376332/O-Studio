<template>
  <div class="home-container">
    <div class="statistics-pane">
      <Statistics :todayDay="todayDay" :key="key" />
    </div>
    <div class="main-info-pane">
      <div class="left-fix-pane">
        <div class="great-quotes-pane">
          <GreatQuotes />
        </div>
        <div class="timer-festivaldays-pane">
          <div class="timer-view">
            <TimerView :todayDay="todayDay" :key="key" />
          </div>
          <div class="festival-view">
            <TodayFestival :todayDay="todayDay" :key="key" />
          </div>
        </div>
        <div class="future-festival-panel">
          <FutureHolidays :todayDay="todayDay" :key="key" />
        </div>
      </div>
      <div class="information-pane">
        <div class="often-use-func-pane">
          <OftenUseFunc />
        </div>
        <div class="news-pane">
          <NewsView />
        </div>
      </div>
    </div>
    <!-- 延迟预加载编辑器组件，避免第一次进入组件造成的卡顿 -->
    <div v-if="shouldLoadEditor" style="display: none">
      <CodingEditor @ready="handleEditorReady" />
    </div>
  </div>
</template>

<script setup name="Home">
import { ref, onMounted, defineAsyncComponent } from 'vue'
import {
  Statistics,
  GreatQuotes,
  TimerView,
  TodayFestival,
  FutureHolidays,
  OftenUseFunc,
  NewsView
} from './components'

const todayDay = ref(new Date())
const isEditorReady = ref(false)
const shouldLoadEditor = ref(false)

const CodingEditor = defineAsyncComponent({
  loader: () => import('@/components/CodingEditor/index.vue'),
  delay: 3000,
  timeout: 10000
})
const key = ref(1)

// 控制组件加载时机
onMounted(async () => {
  // 可以延迟一点时间再加载
  setTimeout(() => {
    shouldLoadEditor.value = true
  }, 100)
})

const handleEditorReady = () => {
  isEditorReady.value = true
  // 这里可以触发其他逻辑
}

window.ipcRenderer.on('reload-home-page', (event) => {
  todayDay.value = new Date();
  key.value++;
  Logger.info('首页已经重新加载,当前时间：',todayDay.value)
})


</script>

<style scoped lang="scss">
.home-container {
  width: 100%;
  height: calc(100vh - 85px);
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 15px 15px;
  box-sizing: border-box;

  .statistics-pane {
    width: 100%;
    height: auto;
    box-sizing: border-box;
  }

  .main-info-pane {
    width: 100%;
    height: calc(100% - 80px);
    display: flex;
    flex-direction: row;
    padding-top: 15px;
    box-sizing: border-box;

    .left-fix-pane {
      width: 365px;
      height: 100%;
      display: flex;
      margin-right: 15px;
      flex-direction: column;
      box-sizing: border-box;

      .great-quotes-pane {
        border: 1px dashed #666;
        border-radius: 5px;
        margin-bottom: 15px;
        flex: 1;
        overflow-y: auto;
        padding: 10px 5px;
        display: flex;
        flex-direction: column;
      }

      .timer-festivaldays-pane {
        display: flex;
        flex-direction: row;
        align-items: center;
        width: 365px;
        height: 140px;
        box-sizing: border-box;

        .timer-view {
          margin-right: 15px;
        }
      }

      .future-festival-panel {
        width: 100%;
        height: 120px;
        margin-top: 15px;
      }
    }

    .information-pane {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      overflow: hidden;

      .often-use-func-pane {
        width: 100%;
        height: 120px;
        border: 1px dashed #666;
        border-radius: 5px;
        margin-bottom: 15px;
        padding: 5px 10px;
      }

      .news-pane {
        width: auto;
        // height: 100%;
        height: calc(100% - 120px);
        overflow: hidden;
      }
    }
  }
}
</style>
