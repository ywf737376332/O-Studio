import { defineStore } from 'pinia'
import { electronStore } from '@/utils/electronStore'
import { getRootStyleValue } from '@/utils'

const useSettingStore = defineStore('system-settings', {
  state: () => ({
    layoutStyle: '',
    themeColor: '',
    themeStyle: '',
    themeStyleColor: '',
    sideBarColor: '',
    showTagView: true,
    showStateBar: true,
    showLogo: true,
    lineNumbers: '',
    wordWrap: '',
    mouseWheelZoom: false,
    fontSize: 14,
    fontFamily: '',
    autoUpdate: true,
    autoLaunch: false,
    closeType: 0,
    isSaveWinSize: false,
    isLockScreen: false,
  }),
  getters: {},
  actions: {
    // 初始化加载数据
    async initLoadSettings() {
      try {
        this.themeColor = await electronStore.get('settings.themeColor')
        this.themeStyle = await electronStore.get('settings.themeStyle')
        this.themeStyleColor = await electronStore.get('settings.themeStyleColor')
        this.showTagView = await electronStore.get('settings.showTagView')
        this.showStateBar = await electronStore.get('settings.showStateBar')
        this.sideBarColor = await electronStore.get('settings.sideBarColor')
        this.showLogo = await electronStore.get('settings.showLogo')
        this.lineNumbers = await electronStore.get('editor.lineNumbers')
        this.wordWrap = await electronStore.get('editor.wordWrap')
        this.mouseWheelZoom = await electronStore.get('editor.mouseWheelZoom')
        this.fontSize = await electronStore.get('editor.fontSize')
        this.fontFamily = await electronStore.get('editor.fontFamily')
        this.layoutStyle = await electronStore.get('settings.layoutStyle')
        this.autoUpdate = await electronStore.get('settings.autoUpdate')
        this.autoLaunch = await electronStore.get('settings.autoLaunch')
        this.closeType = await electronStore.get('settings.closeType')
        this.isSaveWinSize = await electronStore.get('settings.isSaveWinSize')
        this.isLockScreen = await electronStore.get('settings.isLockScreen')
      } catch (error) {
        Logger.error("初始化本地【user-cache】数据到Pinia失败", error)
      }
    },

    /**
     * 保存所有配置
     */
    async saveSystemConfig(sysConfig) {
      return await electronStore.set('settings', sysConfig)
    },

    /**
     * 获取主题样式
     */
    getThemeStyle() {
      return this.themeStyle === 'light' ? false : true
    },
    getEditorTheme() {
      return this.themeStyle === 'light' ? 'vs-dvs' : 'vs-dark'
    },
    getThemeStyleColor() {
      return this.themeStyleColor;
    },
    /**
     * 保存主题样式
     */
    async setThemeStyle(themeState) {
      this.themeStyle = themeState ? 'dark' : 'light'
      const res = await electronStore.set('settings.themeStyle', this.themeStyle)
      if (res) {
        await electronStore.set('settings.themeStyleColor', getRootStyleValue('--main-background-color'))
      }
    },

    /**
     * 获取是否显示侧边栏
     */
    getShowSideBar() {
      return this.layoutStyle === 'layoutA' ? true : false
    },

    /**
     * 获取侧边栏颜色
     */
    getSideBarColor() {
      return this.sideBarColor
    },
    /**
     * 保存侧边栏颜色
     */
    async setSideBarColor(color) {
      this.sideBarColor = color
      return await electronStore.set('settings.sideBarColor', color)
    },

    /**
     * 保存布局样式
     */
    async setLayoutStyle(layoutStyle) {
      this.layoutStyle = layoutStyle
      return await electronStore.set('settings.layoutStyle', layoutStyle)
    },
    /**
     * 获取布局样式
     */
    getLayoutStyle() {
      return this.layoutStyle
    },

    /**
     * 获取状态栏显示状态
     */
    getShowStateBar() {
      return this.showStateBar
    },
    /**
     * 保存状态栏显示状态
     */
    async setShowStateBar(isShow) {
      this.showStateBar = isShow
      return await electronStore.set('settings.showStateBar', isShow)
    },

    /**
     * 获取主题颜色
     */
    getThemeColor() {
      return this.themeColor
    },
    /**
     * 保存主题颜色
     */
    async setThemeColor(color) {
      this.themeColor = color
      return await electronStore.set('settings.themeColor', color)
    },

    /**
     * 获取多选项卡是否开启状态
     */
    getShowTagView() {
      return this.showTagView
    },
    /**
     * 设置多选项卡是否开启状态
     */
    async setShowTagView(isShow) {
      this.showTagView = isShow
      return await electronStore.set('settings.showTagView', isShow)
    },

    setShowLogo(isShow) {
      this.showLogo = isShow
    },

    /**
     * 获取多选项卡是否开启状态
     */
    getLineNumbers() {
      return this.lineNumbers === 'on' ? true : false
    },

    /**
     * 设置多选项卡是否开启状态
     */
    async setLineNumbers(isShow) {
      this.lineNumbers = isShow
      return await electronStore.set('editor.lineNumbers', isShow)
    },

    /**
     * 自动换行
     */
    getWordWrap() {
      return this.wordWrap === 'on' ? true : false
    },

    /**
     * 设置自动换行状态
     */
    async setWordWrap(isShow) {
      this.wordWrap = isShow
      return await electronStore.set('editor.wordWrap', isShow)
    },

    /**
     * 鼠标滚轮改变字体大小
     */
    getMouseWheelZoom() {
      return this.mouseWheelZoom
    },

    /**
     * 设置鼠标滚轮改变字体大小是否开启状态
     */
    async setMouseWheelZoom(isShow) {
      this.mouseWheelZoom = isShow
      return await electronStore.set('editor.mouseWheelZoom', isShow)
    },

    /**
     * 获取编辑器字体大小
     */
    getEditorFontSize() {
      return this.fontSize
    },

    /**
     * 设置编辑器字体大小
     */
    async setEditorFontSize(val) {
      this.fontSize = val
      return await electronStore.set('editor.fontSize', val)
    },

    /**
     * 获取编辑器字体
     */
    getEditorFontFamily() {
      return this.fontFamily
    },

    /**
     * 设置编辑器字体
     */
    async setEditorFontFamily(val) {
      this.fontFamily = val
      return await electronStore.set('editor.fontFamily', val)
    },

    /**
     * 获取是否自动更新版本
     */
    getAutoUpdate() {
      return this.autoUpdate
    },

    /**
     * 设置自动更新版本
     */
    async setAutoUpdate(val) {
      this.autoUpdate = val
      return await electronStore.set('settings.autoUpdate', val)
    },

    /**
     * 获取关闭方式
     */
    getCloseType() {
      return Number(this.closeType)
    },

    /**
     * 设置关闭方式
     */
    async setCloseType(val) {
      this.closeType = val
      return await electronStore.set('settings.closeType', val)
    },

    /**
     * 获取自动更新状态
     */
    getAutoLaunch() {
      return this.autoLaunch
    },

    /**
     * 设置自动更新状态
     */
    async setAutoLaunch(val) {
      this.autoLaunch = val
      return await electronStore.set('settings.autoLaunch', val)
    },

     /**
     * 获取是否保存窗口大小
     */
     getIsSaveWinSize() {
      return this.isSaveWinSize
    },

    /**
     * 设置是否保存窗口大小
     */
    async setIsSaveWinSize(val) {
      this.isSaveWinSize = val
      return await electronStore.set('settings.isSaveWinSize', val)
    },

    /**
     * 获取是否打开锁屏开关
     * @returns 
     */
    getIsLockScreen(){
      return this.isLockScreen;
    },

    /**
     * 设置是否打开锁屏开关
     */
    async setIsLockScreen(val) {
      this.isLockScreen = val
      return await electronStore.set('settings.isLockScreen', val)
    },

  }
})

export default useSettingStore
