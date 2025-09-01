import { app, shell, BrowserWindow } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import iconPath from '../../resources/icon.png?asset'
// 引入electron-store
import { setupStoreIPC } from './store/ipc'
import { store } from './store/store'
import { handelWinBrowserEvent, mainScheduleJob } from './utils/InitEvent'
import { saveExitTime, setAutoLaunch } from './utils'
import { createTray } from './utils/Tray'
import { name } from "../../package.json";
import Logger from './utils/Logger'

const NODE_ENV = process.env.NODE_ENV
let mainWindow;

function createWindow() {
  const width = store.get("app.windowBounds.width");
  const height = store.get("app.windowBounds.height");
  const backgroundColor = store.get("settings.themeStyleColor");
  mainWindow = new BrowserWindow({
    icon: iconPath,
    width: width || 860,
    height: height || 660,
    minWidth: 830,
    minHeight: 620,
    show: false,
    frame: false, // 指定窗口是否有边框
    transparent: false, // 设置窗口是否透明
    backgroundColor: backgroundColor,
    autoHideMenuBar: true, // 菜单栏隐藏
    resizable: true,
    titleBarStyle: 'hidden', // 设置窗口标题栏的样式
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      contextIsolation: false,
      webSecurity: true, // 禁用跨域限制
    }
  })


  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
    mainWindow.setTitle(name)
  })

  // 保存窗口大小
  mainWindow.on('close', () => {
    const isSaveWinSize = store.get("settings.isSaveWinSize");
    if (isSaveWinSize && !mainWindow.isMaximized()) {
      const { width, height } = mainWindow.getBounds()
      store.set('app.windowBounds', { width, height })
      Logger.info(name,"窗口大小保存成功，软件已关闭！")
    }
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }

  mainWindow.webContents.on('did-finish-load', () => {
    // 打开控制台NODE_ENV
    if (NODE_ENV) {
      mainWindow.webContents.openDevTools();
    }
    Logger.info("Page load finish!")
  });
  
  // 执行渲染线程和主线程交互事件监听
  handelWinBrowserEvent()
  // 主进程向渲染进程发送消息
  mainScheduleJob(mainWindow)
}


app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.electron')
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // store主进程与渲染进程通信
  setupStoreIPC()
  // 创建主窗口
  createWindow()
  // 创建托盘
  createTray(mainWindow)
  //开机自启
  setAutoLaunch()

  // 兼容 macOS：在没有窗口时点击 dock 图标会重新创建窗口
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('before-quit', () => {
  // 更新软件使用时间
  saveExitTime()
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})