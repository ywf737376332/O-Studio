import { contextBridge, ipcRenderer, shell } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import Logger from '../main/utils/Logger'

// 暴露ipcRenderer，shell给渲染进程
// window.ipcRenderer = ipcRenderer
const NODE_ENV = process.env.NODE_ENV

const api = {}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.

// 要暴露的功能
const exposeAPIs = () => {
  contextBridge.exposeInMainWorld('electron', electronAPI);
  contextBridge.exposeInMainWorld('api', api);
  contextBridge.exposeInMainWorld('NODE_ENV', NODE_ENV)
  // contextBridge.exposeInMainWorld('ipcRenderer', {
  //   invoke: (channel, data) => ipcRenderer.invoke(channel, data),
  // });
  contextBridge.exposeInMainWorld('shell', shell);
  contextBridge.exposeInMainWorld('Logger', Logger);
};

if (process.contextIsolated) {
  try {
    exposeAPIs()
  } catch (error) {
    console.error('Failed to expose APIs:', error)
  }
} else {
  window.electron = electronAPI
  window.api = api
  window.NODE_ENV = NODE_ENV
  window.ipcRenderer = ipcRenderer
  window.shell = shell
  window.Logger = Logger
}