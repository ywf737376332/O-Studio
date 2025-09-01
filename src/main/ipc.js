import { ipcMain } from 'electron'
/**
 * 窗口工具栏事件
 * @param {*} callback 
 */
const onWinTitleOp = (callback) => {
  ipcMain.on('winTitleOp', (e, data) => {
    callback(e, data)
  })
}

/**
 * 退出APP
 * @param {*} callback 
 */
const onWinExit = (callback) => {
  ipcMain.on('winExit', (event) => {
    callback(event)
  })
}

/**
 * 导出图片文件
 * @param {*} callback 
 */
const onExportImageToFile = (callback) => {
  ipcMain.handle('exportImageToFile', async (event, base64Url) => {
    return callback(event, base64Url)
  })
}


/**
 * 导出文本文件
 * @param {*} callback 
 */
const onExportTextToFile = (callback) => {
  ipcMain.handle('exportTextToFile', async (event, textToCopy) => {
    return callback(event, textToCopy)
  })
}

/**
 * 获取网络数据
 * @param {*} callback 
 */
const fetchData = (callback) => {
  ipcMain.handle('fetch-data', async (event, requestData) => {
    return callback(event, requestData)
  })
}

/**
 * 设置开机自启
 * @param {*} callback 
 */
const onAutoLaunchState = (callback) => {
  ipcMain.handle('set-auto-launch', async (event, enabled) => {
    return callback(event, enabled)
  })
}

/**
 * 打开调试台
 * @param {*} callback 
 */
const onOpenDevTools = (callback) => {
  ipcMain.handle('open-dev-tools', async (event) => {
    return callback(event)
  })
}

/**
 * 获取用户配置目录
 * @param {*} callback 
 */
const onAppConfigPath = (callback) => {
  ipcMain.handle('get-config-path', async (event) => {
    return callback(event)
  })
}

/**
 * 获取用户配置目录
 * @param {*} callback 
 */
const onAppLogPath = (callback) => {
  ipcMain.handle('get-log-path', async (event) => {
    return callback(event)
  })
}

export { onWinTitleOp, onWinExit, onExportImageToFile, onExportTextToFile, fetchData, onAutoLaunchState, onOpenDevTools, onAppConfigPath, onAppLogPath }
