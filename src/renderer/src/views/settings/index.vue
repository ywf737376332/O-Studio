<template>
  <div class="settings-container">
    <div class="settings-content">
      <el-tabs :tab-position="tabPosition" :stretch="true">
        <el-tab-pane label="主题布局">
          <div class="setting-pane">
            <div class="setting-item">
              <div class="item-title-pane">
                <p class="item-label">主题风格</p>
                <p class="item-descript">主题风格目前分为左右结构和上下结构的布局风格</p>
              </div>
              <div class="item-content">
                <ThemeStylePane v-model:val="dataModel.layoutStyle" @handelLayout="handelLayout" />
              </div>
            </div>
            <div class="setting-item" v-if="showSideBar">
              <div class="item-title-pane">
                <p class="item-label">侧边栏颜色</p>
                <p class="item-descript">仅影响左侧边栏配色，建议选择与主题风格和谐的颜色</p>
              </div>
              <div class="item-content">
                <ColorPicker
                  v-model="dataModel.sideBarColor"
                  :colors="predefineSideBarColors"
                  @change="handelSideBarColor"
                />
              </div>
            </div>
            <div class="setting-item">
              <div class="item-title-pane">
                <p class="item-label">主题颜色</p>
                <p class="item-descript">软件主题色，主要操作按钮颜色，建议选用醒目的颜色</p>
              </div>
              <div class="item-content">
                <ColorPicker
                  v-model="dataModel.themeColor"
                  :colors="predefineThemeColors"
                  @change="handelThemeColor"
                />
              </div>
            </div>
            <div class="setting-item">
              <div class="item-title-pane">
                <p class="item-label">暗黑模式</p>
                <p class="item-descript">系统主题风格，目前只支持日间主题和夜间主题模式</p>
              </div>
              <div class="item-content">
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
            <!-- <div class="setting-item">
              <div class="item-title-pane">
                <p class="item-label">系统字体</p>
                <p class="item-descript">除终编辑器外，软件内的字体</p>
              </div>
              <div class="item-content">
                <el-select
                  v-model="dataModel.fontFamily"
                  placeholder="请选择字体"
                  size="small"
                  style="width: 120px"
                  @change="handelEditorFontFamily"
                >
                  <el-option
                    v-for="font in monacoEditorFonts"
                    :key="font.value"
                    :label="font.label"
                    :value="font.value"
                  />
                </el-select>
              </div>
            </div>
            <div class="setting-item">
              <div class="item-title-pane">
                <p class="item-label">字体大小</p>
                <p class="item-descript">除终编辑器外，软件内的字体大小</p>
              </div>
              <div class="item-content">
                <el-input-number
                  class="logo-item"
                  v-model="dataModel.fontSize"
                  :min="6"
                  :max="72"
                  size="small"
                  @change="handelEditorFontSize"
                />
              </div>
            </div> -->
            <!-- <div class="setting-item">
              <div class="item-title-pane">
                <p class="item-label">自定义背景图片</p>
                <p class="item-descript">设置一个自定义背景图片作为软件背景</p>
              </div>
              <div class="item-content">
                <el-button size="small">修改</el-button>
              </div>
            </div> -->
          </div>
        </el-tab-pane>
        <el-tab-pane label="系统配置">
          <div class="setting-pane">
            <div class="setting-item">
              <div class="item-title-pane">
                <p class="item-label">开机自启</p>
                <p class="item-descript">设置应用是否在电脑刚开机时自动启动</p>
              </div>
              <div class="item-content">
                <el-switch v-model="dataModel.autoLaunch" @change="handelAutoLaunch" />
              </div>
            </div>
            <!-- <div class="setting-item">
              <div class="item-title-pane">
                <p class="item-label">禁用系统托盘</p>
                <p class="item-descript">禁用系统托盘，点击关闭按钮将会直接退出（重启生效）</p>
              </div>
              <div class="item-content">
                <el-switch v-model="dataModel.autoLaunch" disabled />
              </div>
            </div> -->
            <div class="setting-item">
              <div class="item-title-pane">
                <p class="item-label">关闭按钮</p>
                <p class="item-descript">
                  此功能决定关闭按钮的功能，点击关闭时是退出软件，还是进驻系统托盘
                </p>
              </div>
              <div class="item-content">
                <el-select
                  v-model="dataModel.closeType"
                  placeholder="请选择关闭方式"
                  size="small"
                  style="width: 130px"
                  @change="handelCloseType"
                >
                  <el-option label="最小化到托盘" :value="0" />
                  <el-option label="退出应用" :value="1" />
                </el-select>
              </div>
            </div>
            <div class="setting-item">
              <div class="item-title-pane">
                <p class="item-label">记录窗口大小</p>
                <p class="item-descript">再次打开软件时，保持窗口大小和上一次一致</p>
              </div>
              <div class="item-content">
                <el-switch v-model="dataModel.isSaveWinSize" @change="handelIsSaveWinSize" />
              </div>
            </div>
            <div class="setting-item">
              <div class="item-title-pane">
                <p class="item-label">调试台</p>
                <p class="item-descript">开启后，可以在调试台中查看应用的日志信息</p>
              </div>
              <div class="item-content">
                <el-button size="small" @click="handelOpenDevTools">打开</el-button>
              </div>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="应用配置">
          <div class="setting-pane">
            <div class="setting-item">
              <div class="item-title-pane">
                <p class="item-label">显示行号</p>
                <p class="item-descript">设置Monaco Editor编辑器是否显示行号</p>
              </div>
              <div class="item-content">
                <el-switch v-model="dataModel.lineNumbers" @change="handelLineNumbers" />
              </div>
            </div>
            <div class="setting-item">
              <div class="item-title-pane">
                <p class="item-label">自动换行</p>
                <p class="item-descript">设置Monaco Editor编辑器是否自动换行</p>
              </div>
              <div class="item-content">
                <el-switch v-model="dataModel.wordWrap" @change="handelWordWrap" />
              </div>
            </div>
            <div class="setting-item">
              <div class="item-title-pane">
                <p class="item-label">鼠标滚轮改变字号</p>
                <p class="item-descript">设置Monaco Editor编辑器是否可以使用鼠标滚轮改变字号</p>
              </div>
              <div class="item-content">
                <el-switch v-model="dataModel.mouseWheelZoom" @change="handelMouseWheelZoom" />
              </div>
            </div>
            <div class="setting-item">
              <div class="item-title-pane">
                <p class="item-label">编辑器字体大小</p>
                <p class="item-descript">设置Monaco Editor编辑器字体大小</p>
              </div>
              <div class="item-content">
                <el-input-number
                  class="logo-item"
                  v-model="dataModel.fontSize"
                  :min="6"
                  :max="72"
                  size="small"
                  @change="handelEditorFontSize"
                />
              </div>
            </div>
            <div class="setting-item">
              <div class="item-title-pane">
                <p class="item-label">编辑器字体</p>
                <p class="item-descript">设置Monaco Editor编辑器字体</p>
              </div>
              <div class="item-content">
                <el-select
                  v-model="dataModel.fontFamily"
                  placeholder="请选择字体"
                  size="small"
                  style="width: 120px"
                  @change="handelEditorFontFamily"
                >
                  <el-option
                    v-for="font in monacoEditorFonts"
                    :key="font.value"
                    :label="font.label"
                    :value="font.value"
                  />
                </el-select>
              </div>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="账号配置" v-if="false">
          软件指纹🆔67c4634f4dbef11e17254d6f请尽快绑定邮箱/微信，否则无法再次登录
          <div class="setting-pane">
            <div class="setting-item">
              <div class="item-title-pane">
                <p class="item-label">头像</p>
                <p class="item-descript">设置一个美美的头像</p>
              </div>
              <div class="item-content">
                <el-button size="small">修改</el-button>
              </div>
            </div>
            <div class="setting-item">
              <div class="item-title-pane">
                <p class="item-label">昵称</p>
                <p class="item-descript">设置一个美美的昵称</p>
              </div>
              <div class="item-content">
                <el-button size="small">修改</el-button>
              </div>
            </div>
            <div class="setting-item">
              <div class="item-title-pane">
                <p class="item-label">邮箱</p>
                <p class="item-descript">绑定邮箱可使用账号密码登录</p>
              </div>
              <div class="item-content">
                <el-button size="small">绑定</el-button>
              </div>
            </div>
            <div class="setting-item">
              <div class="item-title-pane">
                <p class="item-label">密码</p>
                <p class="item-descript">与邮箱配合登录</p>
              </div>
              <div class="item-content">
                <el-button size="small">设置</el-button>
              </div>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="锁屏配置" v-if="false">
          <div class="setting-pane">
            <div class="setting-item">
              <div class="item-title-pane">
                <p class="item-label">锁屏密码</p>
                <p class="item-descript">锁屏密码用于解锁锁屏状态</p>
              </div>
              <div class="item-content">
                <el-button size="small">设置</el-button>
              </div>
            </div>
            <div class="setting-item">
              <div class="item-title-pane">
                <p class="item-label">长时间未操作</p>
                <p class="item-descript">长时间未操作，系统自动进入锁屏状态</p>
              </div>
              <div class="item-content">
                <el-select
                  v-model="dataModel.closeType"
                  placeholder="请选择关闭方式"
                  size="small"
                  style="width: 130px"
                  @change="handelCloseType"
                >
                  <el-option label="不锁屏" :value="0" />
                  <el-option label="5分钟" :value="1" />
                  <el-option label="10分钟" :value="1" />
                  <el-option label="30分钟" :value="1" />
                  <el-option label="1小时" :value="1" />
                  <el-option label="3小时" :value="1" />
                </el-select>
              </div>
            </div>
            <div class="setting-item">
              <div class="item-title-pane">
                <p class="item-label">启用锁屏</p>
                <p class="item-descript">启动时，是否需要输入密码解锁</p>
              </div>
              <div class="item-content">
                <el-switch v-model="dataModel.isLockScreen" @change="handelIsLockScreen" />
              </div>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="数据配置">
          <div class="setting-pane">
            <div class="setting-item">
              <div class="item-title-pane">
                <p class="item-label">应用数据</p>
                <p class="item-descript">当前应用的配置文件，保存了应用数据，尽量避免修改</p>
              </div>
              <div class="item-content">
                <el-button size="small" @click="openUserConfigFile">查看</el-button>
              </div>
            </div>
            <div class="setting-item">
              <div class="item-title-pane">
                <p class="item-label">应用日志</p>
                <p class="item-descript">
                  当前应用的日志文件，可以查看应用的运行日志，用于排查问题
                </p>
              </div>
              <div class="item-content">
                <el-button size="small" @click="openUserLogFile">查看</el-button>
              </div>
            </div>
            <div class="setting-item">
              <div class="item-title-pane">
                <p class="item-label">重置配置</p>
                <p class="item-descript">将当前应用的数据，重置为默认，注意，谨慎使用</p>
              </div>
              <div class="item-content">
                <el-button size="small" plain type="danger">重置配置</el-button>
              </div>
            </div>
            <div class="setting-item">
              <div class="item-title-pane">
                <p class="item-label">刷新缓存</p>
                <p class="item-descript">刷新首页缓存的新闻数据，首页一句话名言数据</p>
              </div>
              <div class="item-content">
                <el-switch v-model="dataModel.mouseWheelZoom" @change="handelMouseWheelZoom" />
              </div>
            </div>
            <div class="setting-item">
              <div class="item-title-pane">
                <p class="item-label">首页提醒</p>
                <p class="item-descript">设置首页提醒数据</p>
              </div>
              <div class="item-content">
                <el-button size="small" plain>添加</el-button>
              </div>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="软件更新">
          <div class="setting-pane">
            <div class="setting-item">
              <div class="item-title-pane">
                <p class="item-label">自动检查更新</p>
                <p class="item-descript">系统启动时，发现新版本则自动弹窗提示</p>
              </div>
              <div class="item-content">
                <el-switch v-model="dataModel.autoUpdate" @change="handelAutoUpdate" />
              </div>
            </div>
            <div class="setting-item">
              <div class="item-title-pane">
                <p class="item-label">当前版本发布时间</p>
                <p class="item-descript">当前软件版本的发布时间</p>
              </div>
              <div class="item-content">
                <span>{{ formatTime(lastBuildTimestamp) }}</span>
              </div>
            </div>
            <div class="setting-item">
              <div class="item-title-pane">
                <p class="item-label">软件版本</p>
                <p class="item-descript">当前软件版本号</p>
              </div>
              <div class="item-content">
                <span>v{{ currentVersion }}</span>
              </div>
            </div>
            <div class="setting-item">
              <div class="item-title-pane">
                <p class="item-label">版本检查</p>
                <p class="item-descript">获取已发布的最新版本信息</p>
              </div>
              <div class="item-content">
                <el-button size="small" :loading="loading" @click="checkLastVersion()"
                  >检查更新</el-button
                >
              </div>
            </div>
            <!-- <div class="setting-item">
              <div class="item-title-pane">
                <p class="item-label">更新日志</p>
                <p class="item-descript">当前软件的更新日志</p>
              </div>
              <div class="item-content">
                <el-button size="small">查看</el-button>
              </div>
            </div> -->
          </div>
        </el-tab-pane>
        <el-tab-pane label="关于我们">
          <div class="setting-pane">
            <div class="about-item">
              <div class="logo">
                <img :src="getImageUrl(avatarImage)" width="50px" height="50px" alt="" />
              </div>
              <div class="descript">
                <p>O-Studio</p>
                <p>一款专为程序员开发的工具箱，堪称程序员的瑞士军刀</p>
              </div>
            </div>
            <div class="setting-item">
              <div class="item-title-pane">
                <p class="item-label">软件作者</p>
                <p class="item-descript">当前软件的开发者，贡献者</p>
              </div>
              <div class="item-content"><span>莫斐鱼</span></div>
            </div>
            <div class="setting-item">
              <div class="item-title-pane">
                <p class="item-label">开发时间</p>
                <p class="item-descript">当前软件的开发时间</p>
              </div>
              <div class="item-content"><span>2024年11月10日</span></div>
            </div>
            <div class="setting-item">
              <div class="item-title-pane">
                <p class="item-label">官方网站</p>
                <p class="item-descript">
                  当前软件的唯一指定的光放网站，您在此网站可以了解到我们的详细信息
                </p>
              </div>
              <div class="item-content">
                <el-button size="small" @click="openOfficialWebSite()">查看</el-button>
              </div>
            </div>
            <!-- <div class="setting-item">
              <div class="item-title-pane">
                <p class="item-label">意见反馈</p>
                <p class="item-descript">可以通过这儿向我们提需求或反馈意见</p>
              </div>
              <div class="item-content">
                <el-button size="small">反馈</el-button>
              </div>
            </div>
            <div class="setting-item">
              <div class="item-title-pane">
                <p class="item-label">许可证</p>
                <p class="item-descript">查看软件授权许可内容</p>
              </div>
              <div class="item-content">
                <el-button size="small">查看</el-button>
              </div>
            </div> -->
            <div class="setting-item">
              <div class="item-title-pane">
                <p class="item-label">邮件联系</p>
                <p class="item-descript">
                  通过这儿联系我们，可以加入我们，官方唯一指定邮箱：737376332@qq.com
                </p>
              </div>
              <div class="item-content">
                <el-button size="small" @click="handelEmailSend()">邮件</el-button>
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <VersionDialog
      :visible="dialogVisible"
      :versionData="versionData"
      @dialogCloseCall="dialogClose"
    ></VersionDialog>
  </div>
</template>

<script setup name="Settings">
import ThemeStylePane from '@/components/ThemeStylePane/index.vue'
import { ref, nextTick, computed, onMounted, onBeforeMount } from 'vue'
import { predefineSideBarColors, predefineThemeColors, monacoEditorFonts } from '@/config'
import useSettingStore from '@/store/modules/settings'
import ColorPicker from '@/components/ColorPicker/index.vue'
import { editorPool } from '@/utils/EditorPool'
import { electronStore } from '@/utils/electronStore'
import { Message } from '@/utils/message'
import VersionDialog from '@/components/VersionDialog/index.vue'
import { getRootStyleValue, formatTime, getImageUrl } from '@/utils'
import { openUpdateDialog } from '@/utils/versionCheck'
import { changeTheme } from '@/utils/changeTheme'
import avatarImage from '@/assets/electron.svg'

const settingStore = useSettingStore()
const themeColor = computed(() => settingStore.getThemeColor())
const currentVersion = computed(() => __APP_INFO__.pkg.version)
const lastBuildTimestamp = computed(() => __APP_INFO__.buildTimestamp)

const showSideBar = computed(() => settingStore.getShowSideBar())
const handelLayout = async (val) => {
  await settingStore.setLayoutStyle(val)
}

const tabPosition = ref('left')

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
  closeType: 0,
  isSaveWinSize: false,
  isLockScreen: false
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
    closeType: settingStore.getCloseType(),
    isSaveWinSize: settingStore.getIsSaveWinSize(),
    isLockScreen: settingStore.getIsLockScreen()
  }
}

const toggleTheme = async () => {
  nextTick(async () => {
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

const handelIsSaveWinSize = async (val) => {
  await settingStore.setIsSaveWinSize(val)
}

const handelOpenDevTools = () => {
  window.ipcRenderer.invoke('open-dev-tools')
}

const handelIsLockScreen = async (val) => {
  await settingStore.setIsLockScreen(val)
}

const getUserConfigPath = async () => {
  return await window.ipcRenderer.invoke('get-config-path')
}

const openUserConfigFile = async () => {
  const configFilePath = await getUserConfigPath()
  await window.shell.openPath(configFilePath)
}

const getUserLogPath = async () => {
  return await window.ipcRenderer.invoke('get-log-path')
}

const openUserLogFile = async () => {
  const logFilePath = await getUserLogPath()
  await window.shell.openPath(logFilePath)
}

const openOfficialWebSite = () => {
  window.shell
    .openExternal('https://gitee.com/yufei88/O-Studio')
    .then(() => {
      loading.value = false
    })
    .catch((err) => {
      loading.value = false
      console.error('打开浏览器失败:', err)
    })
}

const handelEmailSend = () => {
  const recipient = '737376332@qq.com' // 收件人
  const subject = '我是您的O-Studio忠实用户' // 邮件主题
  const body = '希望加入这个大家庭，一起贡献力量' // 邮件正文
  const mailtoUrl = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  window.shell
    .openExternal(mailtoUrl)
    .then(() => {
      loading.value = false
    })
    .catch((err) => {
      loading.value = false
      console.error('打开浏览器失败:', err)
    })
}

const dialogVisible = ref(false)
const versionData = ref({})
const loading = ref(false)
// 二维码对话框关闭回调
const dialogClose = () => {
  dialogVisible.value = false
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
.settings-container {
  width: 100%;
  height: calc(100vh - 85px);
  display: flex;
  flex-direction: column;
  justify-content: center;

  .settings-content {
    width: 100%;
    height: 100%;
    margin: 5px;
    padding: 10px;
    overflow: hidden;

    .setting-pane {
      width: auto;
      height: calc(100vh - 85px);
      padding-bottom: 20px;
      max-width: 800px;
      overflow-x: hidden;
      overflow-y: auto;
      padding-right: 8px;

      .setting-item {
        width: auto;
        height: 80px;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        background-color: var(--main-btn-background-color);
        margin: 8px 10px 8px 10px;
        padding: 5px 15px;
        border-radius: 5px;

        .item-title-pane {
          width: 100%;
          height: 60px;
          display: flex;
          flex-direction: column;
          flex: 1;

          .item-label {
            min-width: 70px;
            height: 30px;
            line-height: 44px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            font-size: 13px;
            color: var(--main-btn-font-color);
            display: flex;
            flex-direction: column;
            flex: 1;
          }

          .item-descript {
            width: 100%;
            height: 30px;
            line-height: 30px;
            font-size: 12px;
          }
        }

        .item-content {
          width: auto;
          height: 60px;
          display: flex;
          flex-direction: row;
          justify-content: flex-end;
          align-items: center;

          > span {
            font-size: 13px;

            &:hover {
              color: v-bind(themeColor);
              text-decoration: underline;
            }
          }
        }
      }

      .about-item {
        width: auto;
        height: 100px;
        display: flex;
        flex-direction: row;
        align-items: center;
        background-color: var(--main-btn-background-color);
        margin: 8px 10px 8px 10px;
        padding: 5px 15px;
        border-radius: 5px;

        .logo {
          width: 80px;
          height: 80px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          border-right: 1px solid #666;
          margin: 0 15px;
        }

        .descript {
          padding: 0 10px;

          > p:first-child {
            font-size: 26px;
            font-weight: 800;
            color: v-bind(themeColor);
            height: 48px;
            background: linear-gradient(90deg, v-bind(themeColor), #8a1ff5); /* 渐变背景 */
            -webkit-background-clip: text; /* 背景裁剪到文字 */
            -webkit-text-fill-color: transparent; /* 文字颜色透明 */
          }
          > p:last-child {
            font-size: 13px;
          }
        }
      }
    }

    /** 颜色选择器样式 */
    :deep(.el-color-picker__trigger) {
      height: 28px;
      min-width: 40px;
    }

    :deep(.el-switch.is-checked .el-switch__core) {
      --el-switch-on-color: v-bind(themeColor);
    }

    :deep(.el-tabs__active-bar) {
      --el-color-primary: v-bind(themeColor);
    }

    :deep(.el-tabs__item.is-active) {
      --el-color-primary: v-bind(themeColor);
    }

    :deep(.el-tabs__item:hover) {
      --el-color-primary: v-bind(themeColor);
    }

    :deep(.el-button:hover) {
      --el-color-primary: v-bind(themeColor);
      --el-button-hover-border-color: v-bind(themeColor);
    }

    :deep(.el-tabs__item) {
      padding: 25px 20px;
      font-size: 13px;
    }

    :deep(.el-tabs__nav) {
      height: calc(100vh - 105px);
    }

    :deep(.el-tabs__nav-scroll) {
      overflow-y: auto;
      overflow-x: hidden;
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
