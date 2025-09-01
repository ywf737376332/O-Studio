import http from './http'
import { formatVersionDesc, getDownloadUrl } from '@/utils/versionCheck'
import { defaultGreatQuotes } from '@/config/defaultContent'
import { isEmpty } from '@/utils'

const getLunarLibLastVersion = () => {
    return http.get('https://registry.npmjs.org/lunar-javascript/latest')
}

const getNews = () => {
    return http.get('http://v.juhe.cn/toutiao/index?type=top&page=1&page_size=15&is_filter=&key=8d11fde6dee43ae752dbbe9473b0a1e2')
}


const getZhihuNews = async () => {
    const newsRes = await http.get('https://www.zhihu.com/api/v3/feed/topstory/hot-lists/total?limit=50&desktop=true');
    // Logger.info("远程获取新闻列表==>",newsRes)
    if (newsRes && newsRes.data) {
        return newsRes.data;
    }
    return []
}

const getLasteVersion = async () => {
    try {
        const versionList = await http.get('https://gitee.com/api/v5/repos/yufei88/O-Studio/releases?page=1&per_page=5&direction=desc')
        // Logger.info("远程获取最新版本列表==>",versionList)
        if (versionList && versionList.length > 0) {
            let lasteVersionInfo = null;
            for (const item of versionList) {
                // 倒序循环时，这是第一次循环，得到的是最新版本
                if (lasteVersionInfo === null) {
                    lasteVersionInfo = {
                        id: item.id,
                        title: item.name,
                        descript: formatVersionDesc(item.body),
                        createdTime: item.created_at,
                        versionTag: item.tag_name,
                        fileUrl: getDownloadUrl(item.body),
                        lastVersionIsForceUpdate: !item.prerelease
                    };
                }
                if (!item.prerelease) {
                    lasteVersionInfo.lastForceUpdateVersion = item.tag_name;
                    return {
                        ...lasteVersionInfo,
                        lastForceUpdateVersion: item.tag_name
                    }
                }
            }
            return lasteVersionInfo;
        }
        return [];
    } catch (error) {
        console.error(`接口请求出错了！${error.message}`)
    }
}

/**
 * 一句话语录
 * @returns 
 */
const getGreatQuotes = async () => {
    const defaultQuotes = {
        hitokoto: defaultGreatQuotes[Math.floor(Math.random() * defaultGreatQuotes.length)],
        type: 'other',
        creator: '莫斐鱼'
    }
    try {
        const random = Math.random();
        if (random < 0.5) {
            const { hitokoto, from, type } = await http.get('https://v1.hitokoto.cn');
            if (isEmpty(hitokoto)) {
                return defaultQuotes
            }
            return {
                hitokoto: hitokoto,
                type: type,
                creator: from
            }
        } else {
            const { data, code } = await http.get('https://api.xygeng.cn/one?timestamp=' + Date.now());
            if (isEmpty(data) && code !== 200) {
                return defaultQuotes
            }
            return {
                hitokoto: data.content,
                type: data.tag,
                creator: data.origin
            }
        }
    } catch (error) {
        console.error(`接口请求出错了！${error.message}`)
        return defaultQuotes
    }
}

export {
    getLunarLibLastVersion,
    getNews,
    getZhihuNews,
    getLasteVersion,
    getGreatQuotes
}