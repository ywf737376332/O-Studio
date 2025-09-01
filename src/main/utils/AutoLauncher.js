import { app } from 'electron'
import AutoLaunch from 'auto-launch'
import { name } from '../../../package.json'

class AutoLauncher {
    constructor() {
        if (!AutoLauncher._instance) {
            this.autoLauncher = new AutoLaunch({
                name: name, // 应用名称
                path: app.getPath('exe'), // 应用启动路径
            })
        }
        AutoLauncher._instance = this;
        return AutoLauncher._instance;
    }


    /**
     * 设置开机自启状态
     * @param {*} enable 
     */
    enableAutoLaunch(enable) {
        if (enable) {
            this.autoLauncher.enable();
        } else {
            this.autoLauncher.disable();
        }
    }

    /**
     * 检查开机是否已启用
     * @returns 
     */
    async isEnabled() {
        return await this.autoLauncher.isEnabled()
    }

}

const autoLauncher = new AutoLauncher();
export default autoLauncher