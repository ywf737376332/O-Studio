import { app, BrowserWindow, dialog } from 'electron'
import path from 'path'
import { updateRuntime, createImageFromBase64 } from '../utils'
import axios from 'axios'
import {
  onWinTitleOp,
  onWinExit,
  onExportImageToFile,
  onExportTextToFile,
  fetchData,
  onAutoLaunchState,
  onOpenDevTools,
  onAppConfigPath,
  onAppLogPath
} from '../ipc'
import fs from 'fs'
import schedule from 'node-schedule'
import { promisify } from 'util'
import autoLauncher from './AutoLauncher'
import Logger from './Logger'
import sharp from 'sharp';

const writeFileAsync = promisify(fs.writeFile)

/************************************Start****************************************************************************************/

/**
 * 渲染进程与主进程的通信事件监听
 */
const handelWinBrowserEvent = () => {

  /**
   * 监听标题工具栏
   */
  onWinTitleOp((e, { action, data }) => {
    const webContents = e.sender
    // 拿到当前窗口
    const win = BrowserWindow.fromWebContents(webContents)
    switch (action) {
      case 'close': {
        if (data.closeType === 1) {
          win.close()
        } else {
          win.setSkipTaskbar(true)
          win.hide()
        }
        break
      }
      case 'minimize': {
        win.minimize()
        break
      }
      case 'maximize': {
        win.maximize()
        break
      }
      case 'unmaximize': {
        win.unmaximize()
        break
      }
      case 'top': {
        win.setAlwaysOnTop(data.top)
        break
      }
    }
  })

  /**
   * 直接退出应用
   */
  onWinExit(async (event) => {
    const webContents = event.sender
    const win = BrowserWindow.fromWebContents(webContents)
    win.close()
  })

  /**
   * 导出图片
   */
  onExportImageToFile(async (event, base64Url) => {
    if (base64Url) {
      try {
        // 去掉 Base64 前缀
        const base64Data = base64Url.replace(/^.*base64,/, '');
        // 使用 sharp 将 SVG 转换为 PNG
        const buffer = await sharp(Buffer.from(base64Data, 'base64')).toFormat('png').toBuffer();
        // 弹出保存对话框
        const { canceled, filePath } = await dialog.showSaveDialog({
          title: '保存文件',
          filters: [{ name: '文件类型', extensions: ['png'] }],
        });
        if (canceled) {
          return { success: false };
        }
        // 写入文件
        await writeFileAsync(filePath, buffer);
        return { success: true, filePath };
      } catch (error) {
        console.error('导出文件失败:', error);
        return { success: false };
      }
    }
  });


  /**
   * 导出文件
   */
  onExportTextToFile(async (event, textToCopy) => {
    if (textToCopy) {
      try {
        const { canceled, filePath } = await dialog.showSaveDialog({
          title: '保存文件',
          filters: [{ name: '文件类型', extensions: ['json'] }]
        })
        if (canceled) {
          return { success: false, canceled: true }
        }
        await writeFileAsync(filePath, textToCopy)
        return { success: true, filePath }
      } catch (error) {
        console.error('导出文件失败:', error)
        return { success: false }
      }
    }
  })

  /**
   * 获取网络数据
   */
  fetchData(async (event, { method, data }) => {
    switch (method) {
      case 'GET': {
        try {
          const response = await axios.get(data)
          return response.data
        } catch (error) {
          throw new Error(`get data fail: ${error.message}`)
        }
      }
      case 'POST': {
        try {
          const response = await axios.post(data.url, data.data)
          return response.data
        } catch (error) {
          throw new Error(`get data fail: ${error.message}`)
        }
      }
    }
  })


  /**
   * 设置开机自启
   */
  onAutoLaunchState(async (event, enabled) => {
    return autoLauncher.enableAutoLaunch(enabled)
  })


  /**
   * 打开调试台
   */
  onOpenDevTools(async (event) => {
    const webContents = event.sender;
    webContents.openDevTools();
    return true
  })

  /**
   * 获取用户配置目录
   */
  onAppConfigPath(async (event) => {
    const userDataPath = app.getPath('userData');
    return path.join(userDataPath, 'config.json')
  })

  /**
   * 获取用户日志目录
   */
  onAppLogPath(async (event) => {
    const userDataPath = app.getPath('userData');
    return path.join(userDataPath, 'logs//main.log')
  })


  // 其他事件



}

/************************************End****************************************************************************************/

/**
 * Node定时任务,每天晚上0点准时更新界面数据
 * @param {*} mainWindow
 */
const mainScheduleJob = (mainWindow) => {
  // 每10秒钟执行一次表达式：*/10 * * * * *
  // 每天0点执行一次 0 0 * * *
  schedule.scheduleJob('0 0 * * *', () => {
    mainWindow.webContents.send('reload-home-page') // 发送消息
    updateRuntime()
  })

  // 每1小时执行一次 0 * * * *
  // 统计板块和一句话名言板块订阅
  schedule.scheduleJob('0 * * * *', () => {
    mainWindow.webContents.send('refresh-system-runtime') // 发送消息
    updateRuntime()
  })

  // 5秒钟后执行一次任务，用于检查更新
  schedule.scheduleJob(new Date(Date.now() + 10000), () => {
    mainWindow.webContents.send('chekc-system-version') // 发送消息
  });
}

export { handelWinBrowserEvent, mainScheduleJob }
