import { isEmpty } from '@/utils'
import { getLasteVersion } from '@/api'


/**
 * 清理版本描述中不必要的信息
 * @param {*} text 
 * @returns 
 */
const formatVersionDesc = (text) => {
    return text.replace(/<download>.*?<\/download>/g, '');
}

/**
 * 解析下载地址
 * @param {*} text 
 * @returns 
 */
const getDownloadUrl = (text) => {
    // 使用正则表达式提取 <download></download> 标签中的内容
    const regex = /<download>(.*?)<\/download>/g;
    const match = text.match(regex);
    if (match) {
        return match[0].replace(/<\/?download>/g, ''); // 去掉标签
    }
}

/**
 * 版本号比较
 * @param {*} v1 
 * @param {*} v2 
 * @returns 
 */
function compareVersions(v1, v2) {
    // 去掉前缀（如 'v'），并拆分成数组
    const parts1 = v1.replace(/^v/, '').split('.');
    const parts2 = v2.replace(/^v/, '').split('.');
    // 逐位比较
    for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
        // 如果某一位缺失，默认为 0
        const num1 = parseInt(parts1[i] || 0, 10);
        const num2 = parseInt(parts2[i] || 0, 10);

        if (num1 > num2) return 1; // v1 大于 v2
        if (num1 < num2) return -1; // v1 小于 v2
    }
    return 0; // v1 等于 v2
}


/**
 * 计算是否需要强制更新
 * @param {*} currentVersion 
 * @param {*} lastVersionInfo 
 * @returns 
 */
const getIsForceUpdate = (currentVersion, lastVersionInfo) => {
    // 如果当前版本小于最后一个强制更新版本，则必须要强制更新
    if ( !isEmpty(lastVersionInfo?.lastForceUpdateVersion) && compareVersions(currentVersion, lastVersionInfo.lastForceUpdateVersion) <= 0) {
        return true
        // 如果当前版本小于最后一个版本，并且最后一个版本是强制更新版本时，则必须要强制更新
    } else if (
        compareVersions(currentVersion, lastVersionInfo?.versionTag) < 0 &&
        lastVersionInfo.lastVersionIsForceUpdate
    ) {
        return true
    }
    return false
}

/**
 * 打开版本更新对话框
 * @param {*} currentVersion 
 * @returns 
 */
const openUpdateDialog = async (currentVersion) => {
    const lastVersionInfo = await getLasteVersion()
    lastVersionInfo.isForceUpdate = getIsForceUpdate(currentVersion, lastVersionInfo)
    const lastVersion = lastVersionInfo?.versionTag
    if (isEmpty(lastVersionInfo) || compareVersions(lastVersion, currentVersion) <= 0) {
        return {
            isNeedUpdate: false,
            isForceUpdate: lastVersionInfo.isForceUpdate,
            lastVersionInfo: lastVersionInfo
        }
    }
    return {
        isNeedUpdate: true,
        isForceUpdate: lastVersionInfo.isForceUpdate,
        lastVersionInfo: lastVersionInfo
    }
}

/**
 * 初始化检查版本
 */
const checkVersion = async (autoUpdate, currentVersion) => {
    const { isNeedUpdate, isForceUpdate, lastVersionInfo } = await openUpdateDialog(currentVersion)
    if (isForceUpdate) {
        return {
            lastVersion: lastVersionInfo,
            updateDialogVisible: true
        }
    } else if (isNeedUpdate && autoUpdate) {
        return {
            lastVersion: lastVersionInfo,
            updateDialogVisible: true
        }
    } else {
        return {
            lastVersion: lastVersionInfo,
            updateDialogVisible: false
        }
    }
}

export {
    formatVersionDesc,
    getDownloadUrl,
    compareVersions,
    openUpdateDialog,
    checkVersion
}