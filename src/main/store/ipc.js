import { ipcMain } from 'electron'
import { store } from './store'

export function setupStoreIPC() {
  // 获取存储值
  ipcMain.handle('store:get', (_, key) => {
    return store.get(key)
  })

  // 设置存储值
  ipcMain.handle('store:set', (_, key, value) => {
    store.set(key, value)
    return true
  })

  // 删除存储值
  ipcMain.handle('store:delete', (_, key) => {
    store.delete(key)
    return true
  })

  // 清空存储
  ipcMain.handle('store:clear', () => {
    store.clear()
    return true
  })
}