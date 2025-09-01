import Store from 'electron-store'

class StoreManager {
  static instance = null
  
  constructor() {
    this.store = new Store({
      defaults: {
        app: {
          windowBounds: {
            width: 850,
            height: 670
          }
        },
        editor: {
          lineNumbers: 'on',
          wordWrap: 'on',
          mouseWheelZoom: false,
          fontSize: 14,
          fontFamily: "Consolas, 'Courier New', monospace, 'JetBrains Mono'"
        },
        settings: {
          layoutStyle: 'layoutA',
          themeColor: '#07c160',
          themeStyle: 'light',
          themeStyleColor: '#FFFFFF',
          sideBarColor: '#2E2E2E',
          showTagView: true,
          showStateBar: true,
          showLogo: true,
          autoUpdate: true,
          closeType: 0,
          autoLaunch: false,
          isSaveWinSize: false,
          isLockScreen: false,
        },
        userData: {
          totalRuntime: 0,      // 启动次数
          launchCounts: 0,      // 累计运行时间
          tmpUpdateTime: 0,     // 上一次运行时长更新时间
          lastStartTime: 0,     // 上次启动时间
          lastExitTime: 0,      // 上次退出时间
          visitFunction: null,  // 菜单使用次数统计
          collectMenus: null    // 收藏菜单列表
        }
      }
    })
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new StoreManager()
    }
    return this.instance
  }

  get() {
    return this.store
  }
}

// 导出单例
const storeManager = StoreManager.getInstance()
const store = storeManager.get()

export { store }