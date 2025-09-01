<template>
  <div class="container">
    <SideBar v-if="showSideBar" @changeMenu="changeMenu"></SideBar>
    <div class="right-container">
      <TitleBar :title="appInfoStore.winTitle"></TitleBar>
      <TagsView v-show="showTagView" />
      <!-- children子路由组件 -->
      <div class="body-content">
        <slot name="container"></slot>
      </div>
      <StateBar v-if="showStateBar" :contentType="appInfoStore.languageType" :words="appInfoStore.wordCounts"
        :mousePos="{ line: appInfoStore.cursorPosLine, row: appInfoStore.cursorPosRow }" />
    </div>
  </div>
  <LockScreen :showDrawer="showLockScreenDrawer" @handleClose="handleLockScreenClose"></LockScreen>
  <History :showDrawer="showHistoryDrawer" @handleClose="handleHistoryClose"></History>
  <WinOp :closeType="closeType" @closeCallback="closeCallFun()" @handelClickMenu="handelClickMenu"></WinOp>
  <MenuOp @handelClickMenu="handelClickMenu" />
</template>

<script setup>
import { onMounted, onUnmounted, onBeforeUnmount, ref, computed, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { electronStore } from '@/utils/electronStore'
import {
  SideBar,
  TitleBar,
  TagsView,
  StateBar,
  WinOp,
  History,
  LockScreen,
  MenuOp
} from './components'
import useAppInfoStore from '@/store/modules/appInfo'
import { Notification } from '@/utils/message'
import useSettingStore from '@/store/modules/settings'
import { menuList } from '@/config/sideBarMenuList'

const settingStore = useSettingStore()
const appInfoStore = useAppInfoStore()
const router = useRouter()

const showHistoryDrawer = ref(false)
const showLockScreenDrawer = ref(false)

const showSideBar = computed(() => settingStore.getShowSideBar())
const showStateBar = computed(() => settingStore.getShowStateBar())
const showTagView = computed(() => settingStore.getShowTagView())
const leftBorder = computed(() => (showSideBar.value === false ? '1px' : '1px'))
const closeType = computed(() => settingStore.getCloseType())

// 点击左侧按钮打开抽屉面板
const changeMenu = (item) => {
  const name = item.name
  handelMenuEvent(name)
}

const handelMenuEvent = (name) => {
  if (menuList.some(item => item.name === name && item.type === 1)) {
    router.push({ name })
  } else if (name === 'History') {
    showHistoryDrawer.value = true
  } else {
    Notification({
      title: '开发中...',
      message: '当前功能正在开发中，尽请期待！',
      type: 'warning'
    })
    return
  }
}

// 设置主题抽屉面板关闭前回调
const handleHistoryClose = () => {
  showHistoryDrawer.value = false
}

const handleLockScreenClose = () => {
  showLockScreenDrawer.value = false
}

const initData = async () => {
  showLockScreenDrawer.value = await electronStore.get("settings.isLockScreen")
}

onMounted(async () => {
  nextTick(async () => {
    await initData()
  })
})

onBeforeUnmount(() => {
  Logger.info('组件卸载之前')
})
onUnmounted(() => {
  Logger.info('组件被卸载时调用')
})

const closeCallFun = () => {
  Logger.info('窗口关闭了，可左关闭提示')
}

const handelClickMenu = (val) => {
  handelMenuEvent(val)
}
</script>

<style scoped lang="scss">
.container {
  margin: 0 auto;
  display: flex;
  width: 100%;
  height: 100%;
  overflow: hidden;

  .right-container {
    width: calc(100% - 45px);
    // height: calc(100% - 0.41px);
    border-top-right-radius: 2px;
    border-bottom-right-radius: 2px;
    background-color: var(--main-background-color);
    flex: 1;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    border-left: v-bind(leftBorder) solid var(--main-border-color); // 1.6
    border-right: 1.5px solid var(--main-border-color); // 1.6
    border-top: 1px solid var(--main-border-color); // 1.6
    border-bottom: 1.5px solid var(--main-border-color); // 1.6

    //border-left: none;
    .body-content {
      width: 100%; // 占父组件的所有宽度，父组件是right-container,宽度已减去左侧边栏
      // height: calc(100% - 85px);
      flex: 1;
      overflow-x: hidden;
      overflow-y: auto;
      overflow: -moz-scrollbars-none;
      /* Firefox */
      -ms-overflow-style: none;
      /* IE 和 Edge */
      scrollbar-width: none;
      /* Firefox */
    }
  }
}
</style>
