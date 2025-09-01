import { Message } from '@/utils/message'
/**
 * 监测是不是Electron环境
 * @returns 
 */
export const isElectron = () => {
    const isElect = typeof window !== 'undefined' && window.ipcRenderer !== undefined;
    if (isElect) {
        return typeof window !== 'undefined' && window.ipcRenderer !== undefined
    } else {
        Message({
            message: '请注意，当前环境非客户端环境，部分功能受限！',
            type: 'warning'
        })
        return false;
    }
}