import { store } from '../store/store'
import autoLauncher from './AutoLauncher'
import logger from './Logger';

/**
 * 更新系统运行时间
 * @returns 
 */
const updateRuntime = async () => {
    const [totalRuntime, tmpUpdateTime] = await Promise.all([getTotalRuntime(), getTmpUpdateTime()])
    const currentTime = Date.now();
    const currentRuntime = currentTime - tmpUpdateTime;
    await store.set('userData.tmpUpdateTime', currentTime);
    return await store.set('userData.totalRuntime', totalRuntime + currentRuntime)
}


/**
 * 保存系统退出时间
 * @returns 
 */
const saveExitTime = async () => {
    await updateRuntime()
    return await store.set('userData.lastExitTime', Date.now())
}
const getTotalRuntime = async () => {
    return await store.get('userData.totalRuntime')
}
const getTmpUpdateTime = async () => {
    return await store.get('userData.tmpUpdateTime')
}

/**
 * 设置开机自启
 */
const setAutoLaunch = () => {
    const autoLaunchState = store.get("settings.autoLaunch");
    autoLauncher.isEnabled().then((enabled) => {
        // 检查状态不一致的时候，已用户设置为主，同步状态
        if(autoLaunchState !== enabled){
            autoLauncher.enableAutoLaunch(autoLaunchState)
            autoLauncher.isEnabled().then((state)=>{
                logger.info("开机自启设置成功>状态：",state)
            })
        }
    })
}


export { updateRuntime, saveExitTime, setAutoLaunch }