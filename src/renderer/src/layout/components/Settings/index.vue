<template>
  <!-- 右侧展开抽屉 -->
  <DrawerViewer :showDrawer="showDrawer" :size="40" @handleClose="handleClose" @openBeforeEvent="openBeforeEvent">
    <template #main>
      <div class="drawer-container">
        <div class="setting-pane">
          <p class="pane-title">主题风格</p>
          <div class="theme-pane">
            <!-- <p>主题风格</p> -->
            <div class="theme-style">
              <ThemeStylePane v-model:val="dataModel.layoutStyle" @handelLayout="handelLayout" />
            </div>
            <!-- <div class="setting-item" v-if="showSideBar">
              <span class="item-label">侧边栏颜色</span>
              <el-color-picker v-model="dataModel.sideBarColor" show-alpha :predefine="predefineSideBarColors" size="small"/>
            </div> -->
            <div class="setting-item" v-if="showSideBar">
              <span class="item-label">侧边栏颜色</span>
              <ColorPicker v-model="dataModel.sideBarColor" :colors="predefineSideBarColors"
                @change="handelSideBarColor" />
            </div>
            <div class="setting-item">
              <span class="item-label">主题颜色</span>
              <ColorPicker v-model="dataModel.themeColor" :colors="predefineThemeColors" @change="handelThemeColor" />
            </div>
            <div class="setting-item">
              <span class="item-label">暗黑模式</span>
              <el-switch v-model="dataModel.themeStyle" @change="toggleTheme()">
                <template #active-action>
                  <span class="iconfont icon-dark" style="color: #666"></span>
                </template>
                <template #inactive-action>
                  <span class="iconfont icon-light" style="color: darkorange"></span>
                </template>
              </el-switch>
            </div>
          </div>
        </div>
        <div class="setting-pane" v-show="true">
          <p class="pane-title">布局配置</p>
          <div class="system-config">
            <div class="setting-item">
              <span class="item-label">开启多选项卡</span>
              <el-switch v-model="dataModel.showTagView" @change="handelShowTagView" />
            </div>
            <div class="setting-item">
              <span class="item-label">显示状态栏</span>
              <el-switch v-model="dataModel.showStateBar" @change="handelShowStateBar" />
            </div>
          </div>
        </div>
        <div class="setting-pane">
          <p class="pane-title">代码编辑器设置</p>
          <div class="system-config">
            <div class="setting-item">
              <span class="item-label">显示行号</span>
              <el-switch v-model="dataModel.lineNumbers" @change="handelLineNumbers" />
            </div>
            <div class="setting-item">
              <span class="item-label">自动换行</span>
              <el-switch v-model="dataModel.wordWrap" @change="handelWordWrap" />
            </div>
            <div class="setting-item">
              <span class="item-label">鼠标滚轮改变字号</span>
              <el-switch v-model="dataModel.mouseWheelZoom" @change="handelMouseWheelZoom" />
            </div>
            <div class="setting-item">
              <span class="item-label">字号</span>
              <el-input-number class="logo-item" v-model="dataModel.fontSize" :min="6" :max="72" size="small"
                @change="handelEditorFontSize" />
            </div>
            <div class="setting-item">
              <span class="item-label">字体</span>
              <el-select v-model="dataModel.fontFamily" placeholder="请选择字体" size="small" style="width: 120px"
                @change="handelEditorFontFamily">
                <el-option v-for="font in monacoEditorFonts" :key="font.value" :label="font.label"
                  :value="font.value" />
              </el-select>
            </div>
          </div>
        </div>
        <div class="setting-pane">
          <p class="pane-title">应用设置</p>
          <div class="system-config">
            <div class="setting-item">
              <span class="item-label">自动检查更新</span>
              <el-switch v-model="dataModel.autoUpdate" @change="handelAutoUpdate" />
            </div>
            <div class="setting-item">
              <span class="item-label">当前版本发布时间</span>
              <span class="item-value">{{ formatTime(lastBuildTimestamp) }}</span>
            </div>
            <div class="setting-item">
              <span class="item-label">开机自启</span>
              <el-switch v-model="dataModel.autoLaunch" @change="handelAutoLaunch" />
            </div>
            <div class="setting-item">
              <span class="item-label">关闭按钮</span>
              <el-select v-model="dataModel.closeType" placeholder="请选择关闭方式" size="small" style="width: 120px"
                @change="handelCloseType">
                <el-option label="最小化到托盘" :value="0" />
                <el-option label="退出应用" :value="1" />
              </el-select>
            </div>
            <div class="setting-item">
              <span class="item-label">悬浮球模式</span>
              <el-switch v-model="dataModel.floatBallMode" disabled />
            </div>
          </div>
        </div>
        <div class="setting-pane">
          <p class="pane-title">软件信息</p>
          <div class="system-config">
            <div class="setting-item">
              <span class="item-label">软件版本</span>
              <span class="item-value">v{{ currentVersion }}</span>
            </div>
            <div class="setting-item">
              <span class="item-label">版本检查</span>
              <el-button type="primary" size="small" :color="themeColor" :loading="loading"
                @click="checkLastVersion()">检查更新</el-button>
            </div>
            <div class="setting-item">
              <span class="item-label">软件作者</span>
              <span class="item-value">莫斐鱼</span>
            </div>
            <div class="setting-item">
              <span class="item-label">开发时间</span>
              <span class="item-value">2024年11月10日</span>
            </div>
          </div>
        </div>
      </div>
    </template>
  </DrawerViewer>
  <VersionDialog :visible="dialogVisible" :versionData="versionData" @dialogCloseCall="dialogClose"></VersionDialog>
</template>

<script setup>
import DrawerViewer from '@/components/DrawerViewer/index.vue'
import ThemeStylePane from '@/components/ThemeStylePane/index.vue'
import { ref, nextTick, computed, onMounted, onBeforeMount } from 'vue'
import * as monaco from 'monaco-editor'
import { predefineSideBarColors, predefineThemeColors, monacoEditorFonts } from '@/config'
import useSettingStore from '@/store/modules/settings'
import ColorPicker from '@/components/ColorPicker/index.vue'
import { editorPool } from '@/utils/EditorPool'
import { electronStore } from '@/utils/electronStore'
import { openUpdateDialog, checkVersion } from '@/utils/versionCheck'
import { Message } from '@/utils/message'
import VersionDialog from '@/components/VersionDialog/index.vue'
import { getRootStyleValue, formatTime } from '@/utils'
import { changeTheme } from '@/utils/changeTheme'

const settingStore = useSettingStore()
const themeColor = computed(() => settingStore.getThemeColor())
const currentVersion = computed(() => __APP_INFO__.pkg.version)
const autoUpdate = computed(() => settingStore.getAutoUpdate())
const lastBuildTimestamp = computed(() => __APP_INFO__.buildTimestamp)

const props = defineProps({
  showDrawer: {
    type: Boolean,
    default: true
  },
  showSideBar: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['handleClose'])
const handleClose = () => {
  emit('handleClose')
}

const handelLayout = async (val) => {
  await settingStore.setLayoutStyle(val)
}

const dataModel = ref({
  layoutStyle: '',
  themeColor: '',
  themeStyle: '',
  sideBarColor: '',
  showTagView: false,
  showStateBar: false,
  showLogo: false,
  lineNumbers: settingStore.getLineNumbers(),
  wordWrap: settingStore.getWordWrap(),
  mouseWheelZoom: false,
  fontSize: 14,
  fontFamily: '',
  autoUpdate: true,
  autoLaunch: false,
  floatBallMode: false,
  closeType: 0
})

onMounted(async () => {
  // 直接刚启动时，从electron-store中获取主题样式，更直接
  const themeStyle = await electronStore.get('settings.themeStyle')
  const isDark = themeStyle === 'light' ? false : true
  nextTick(() => {
    changeTheme(isDark)
  })
})

onBeforeMount(() => {
  // 先初始化
  initSettingModel()
})

const openBeforeEvent = () => {
  // 补充初始化
  initSettingModel()
}

const initSettingModel = () => {
  dataModel.value = {
    layoutStyle: settingStore.getLayoutStyle(),
    themeColor: settingStore.getThemeColor(),
    themeStyle: settingStore.getThemeStyle(),
    sideBarColor: settingStore.getSideBarColor(),
    showTagView: settingStore.getShowTagView(),
    showStateBar: settingStore.getShowStateBar(),
    showLogo: settingStore.showLogo,
    lineNumbers: settingStore.getLineNumbers(),
    wordWrap: settingStore.getWordWrap(),
    mouseWheelZoom: settingStore.getMouseWheelZoom(),
    fontSize: settingStore.getEditorFontSize(),
    fontFamily: settingStore.getEditorFontFamily(),
    autoUpdate: settingStore.getAutoUpdate(),
    autoLaunch: settingStore.getAutoLaunch(),
    closeType: settingStore.getCloseType()
  }
}

const toggleTheme = async () => {
  nextTick(async() => {
    const isDark = dataModel.value.themeStyle
    changeTheme(isDark)
    if (isDark) {
      setDarkThemeSideBarColor()
    }
    await settingStore.setThemeStyle(isDark)
  })
}

const setDarkThemeSideBarColor = () => {
  const sideBarBackgroundColor = getRootStyleValue('--main-left-sider-background-color')
  // 暗黑主题模式,默认设置侧边栏
  dataModel.value.sideBarColor = sideBarBackgroundColor
  handelSideBarColor(sideBarBackgroundColor)
}

const handelShowStateBar = async (val) => {
  await settingStore.setShowStateBar(val)
}

const handelSideBarColor = async (val) => {
  await settingStore.setSideBarColor(val)
}

const handelThemeColor = async (val) => {
  await settingStore.setThemeColor(val)
}

const handelShowTagView = async (val) => {
  await settingStore.setShowTagView(val)
}

const handelLineNumbers = async (val) => {
  const state = val ? 'on' : 'off'
  const res = await settingStore.setLineNumbers(state)
  if (res) {
    editorPool.updateAllOptions({
      lineNumbers: state
    })
  }
}

const handelWordWrap = async (val) => {
  const state = val ? 'on' : 'off'
  const res = await settingStore.setWordWrap(state)
  if (res) {
    editorPool.updateAllOptions({
      wordWrap: state
    })
  }
}

const handelMouseWheelZoom = async (val) => {
  const res = await settingStore.setMouseWheelZoom(val)
  if (res) {
    editorPool.updateAllOptions({
      mouseWheelZoom: val
    })
  }
}

const handelEditorFontSize = async (val) => {
  const res = await settingStore.setEditorFontSize(val)
  if (res) {
    editorPool.updateAllOptions({
      fontSize: val
    })
  }
}

const handelEditorFontFamily = async (val) => {
  const res = await settingStore.setEditorFontFamily(val)
  if (res) {
    editorPool.updateAllOptions({
      fontFamily: val
    })
  }
}

const handelAutoUpdate = async (val) => {
  await settingStore.setAutoUpdate(val)
}

const handelAutoLaunch = async (val) => {
  if (window.NODE_ENV) {
    Message({
      message: `开发环境不能使用此功能！`,
      type: 'warning'
    })
    dataModel.value.autoLaunch = !val
    return false
  }
  const res = await settingStore.setAutoLaunch(val)
  if (res) {
    window.ipcRenderer.invoke('set-auto-launch', val)
  }
}

const handelCloseType = async (val) => {
  await settingStore.setCloseType(val)
}

const dialogVisible = ref(false)
const versionData = ref({})
const loading = ref(false)
// 对话框关闭回调
const dialogClose = () => {
  dialogVisible.value = false
}

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

const checkLastVersion = async () => {
  loading.value = true
  const { isNeedUpdate, lastVersionInfo } = await openUpdateDialog(currentVersion.value)
  if (!isNeedUpdate) {
    loading.value = false
    Message({
      message: `您的软件已是最新版本！`,
      type: 'success'
    })
    return
  }
  versionData.value = lastVersionInfo
  dialogVisible.value = true
  loading.value = false
}
</script>

<style scoped lang="scss">
.drawer-container {
  width: 100%;
  height: auto;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;

  .setting-pane {
    padding-bottom: 20px;

    .pane-title {
      border-bottom: 1px dashed #666;
      border-left: 5px solid #259b37;
      padding-bottom: 5px;
      padding-left: 5px;
      margin-bottom: 5px;
      height: 22px;
      line-height: 22px;
    }
  }

  .theme-pane {
    width: 100%;
    display: flex;
    flex-direction: column;
    padding: 0 15px;

    >p {
      color: var(--main-btn-font-color);
    }

    .theme-style {
      display: flex;
      width: 100%;
      height: 40px;
      margin-top: 15px;
      margin-bottom: 15px;
      justify-content: flex-start;
      align-items: center;

      >i {
        margin-right: 30px;
        font-size: 36px;
        box-shadow:
          rgba(197, 197, 198, 0.35) 0px 10px 38px -10px,
          rgba(167, 169, 171, 0.2) 0px 10px 20px -15px;
        border-radius: 3px;
      }
    }
  }

  .system-config {
    width: 100%;
    display: flex;
    flex-direction: column;
    padding: 0 15px;

    >p {
      font-size: 14px;
      color: var(--main-btn-font-color);
      margin-bottom: 10px;
    }
  }

  .setting-item {
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;

    /** 颜色选择器样式 */
    :deep(.el-color-picker__trigger) {
      height: 28px;
      min-width: 40px;
    }

    .item-label {
      min-width: 70px;
      line-height: 44px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      font-size: 13px;
      color: var(--main-btn-font-color);
      flex: 1;

      &:after {
        content: '：';
      }
    }

    .item-value {
      font-size: 13px;

      &:hover {
        color: #0078d4;
        text-decoration: underline;
      }
    }
  }

  :deep(.el-switch.is-checked .el-switch__core) {
    --el-switch-on-color: v-bind(themeColor);
  }
}

.theme-bottom {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
}
</style>
