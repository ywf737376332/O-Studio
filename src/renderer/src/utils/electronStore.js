const ipcRenderer = window.ipcRenderer;
export const electronStore = {
  get: async (key) => {
    return await ipcRenderer.invoke('store:get', key)
  },
  
  set: async (key, value) => {
    return await ipcRenderer.invoke('store:set', key, value)
  },
  
  delete: async (key) => {
    return await ipcRenderer.invoke('store:delete', key)
  },
  
  clear: async () => {
    return await ipcRenderer.invoke('store:clear')
  }
}