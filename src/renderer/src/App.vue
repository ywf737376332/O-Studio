<template>
  <!-- Vue 组件 ConfigProvider 用于全局配置国际化的设置。好好 -->
  <div class="app">
    <div class="main" v-if="showView">
      <img src="@/assets/electron.svg" alt="" />
    </div>
    <router-view v-else />
    <VersionDialog :visible="dialogVisible" :versionData="versionData" @dialogCloseCall="dialogClose"></VersionDialog>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, nextTick, computed } from 'vue'
import VersionDialog from '@/components/VersionDialog/index.vue'
import useSettingStore from '@/store/modules/settings'
import useUserCacheStore from '@/store/modules/userCache'
import useUserMenusStore from '@/store/modules/menus'   
import { useRoute } from 'vue-router'
import { checkVersion } from '@/utils/versionCheck'
import { electronStore } from '@/utils/electronStore'
import { changeTheme } from '@/utils/changeTheme'

const settingStore = useSettingStore()
const userCacheStore = useUserCacheStore()
const userMenusStore = useUserMenusStore() //不可删除，显式调用才能优先初始化

const dialogVisible = ref(false)
const versionData = ref({})

const route = useRoute()
const showView = ref(true)
const themeStyleColor = computed(() => settingStore.getThemeStyleColor())
const currentVersion = computed(() => __APP_INFO__.pkg.version)
const autoUpdate = computed(() => settingStore.getAutoUpdate())

const dialogClose = () => dialogVisible.value = false

onMounted(async () => {
  // 直接刚启动时，从electron-store中获取主题样式，更直接
  const themeStyle = await electronStore.get('settings.themeStyle')
  const isDark = themeStyle === 'light' ? false : true
  nextTick(() => {
    changeTheme(isDark)
  })
})

watch(route, () => {
  nextTick(async () => {
    showView.value = false
    await saveRouterVisit(route)
  })
})

// 不被记录在历史记录的路由列表
const EXCLUDE_ROUTES = ['Home', 'Settings', 'Menus']

/**
 * 记录每个功能的访问记录
 * @param route
 */
const saveRouterVisit = async (route) => {
  const toPage = route?.name
  if (toPage && !EXCLUDE_ROUTES.includes(toPage)) {
    await userCacheStore.setVisitFunction(toPage)
  }
}

window.ipcRenderer.on('chekc-system-version', async (event) => {
  await initCheckVersion()
  Logger.info('检查软件是否有最新版本', autoUpdate.value, currentVersion.value)
})

const initCheckVersion = async () => {
  const { lastVersion, updateDialogVisible } = await checkVersion(
    autoUpdate.value,
    currentVersion.value
  )
  if (updateDialogVisible) {
    dialogVisible.value = true
    versionData.value = lastVersion
  }
}
</script>

<style scoped lang="scss">
.app {
  width: 100vw;
  min-width: 720px;
  height: 100vh;

  .main {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: v-bind(themeStyleColor);

    img {
      width: 100px;
      aspect-ratio: 1 / 1;
    }
  }
}
</style>
