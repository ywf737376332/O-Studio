import { defineStore } from 'pinia'
import { electronStore } from '@/utils/electronStore'
import { isEmpty } from '@/utils'

const useUserCacheStore = defineStore('user-cache', {
  state: () => ({
    // 首页缓存相关
    fullYearFestivals: new Map([]),
    newsList: [],

    // 启动相关
    totalRuntime: 0,
    launchCounts: 0,
    startTime: 0,

    // 菜单点击统计
    visitFunction: new Map([]),
    collectMenus: new Set(),
  }),
  getters: {
    async getStoreTotalRuntime() {
      return await electronStore.get('userData.totalRuntime')
    },
    async getStoreLaunchCounts() {
      return await electronStore.get('userData.launchCounts')
    },
    async initStoreLaunchInfo() {
      await electronStore.set('userData.launchCounts', this.launchCounts);
      await electronStore.set('userData.lastStartTime', this.startTime);
      await electronStore.set('userData.tmpUpdateTime', this.startTime);
      const lastVisitFunction = await electronStore.get('userData.visitFunction')
      if(!isEmpty(lastVisitFunction)) {
        this.visitFunction = new Map(Object.entries(lastVisitFunction))
      }
      const lastCollectMenus = await electronStore.get('userData.collectMenus')
      if(!isEmpty(lastCollectMenus)){
        this.collectMenus = new Set(lastCollectMenus)
      }
    },
    async saveCollectMenus() {
      electronStore.set('userData.collectMenus', [...this.collectMenus]);
    }
  },
  actions: {

    async initAppData() {
      try {
        const [totalRuntime, launchCounts] = await Promise.all([this.getStoreTotalRuntime, this.getStoreLaunchCounts])
        this.totalRuntime = totalRuntime;
        this.launchCounts = launchCounts;
        this.launchCounts += 1;
        this.startTime = Date.now();
        await this.initStoreLaunchInfo
      } catch (error) {
        Logger.error("初始化本地【user-cache】数据到Pinia失败")
      }
    },

    /**
     * 全年节假日缓存
     */
    getFullYearFestivals(key) {
      return this.fullYearFestivals.get(key);
    },

    async setFullYearFestivals(key, value) {
      this.fullYearFestivals.set(key, value);
    },

    /**
     * 热点新闻缓存
     */
    getNewsList() {
      return this.newsList;
    },

    async setNewsList(newsList) {
      this.newsList = newsList;
    },

    /**
     * 获取软件启动时间
     */
    getStartTime() {
      return this.startTime;
    },
    /**
     * 累计使用时间
     */
    async getTotalRuntime() {
      return await this.getStoreTotalRuntime
    },

    /**
     * 累计启动次数
     */
    getLaunchCounts() {
      return this.launchCounts;
    },

    /**
     * 菜单访问记录
     */

    getVisitFunctionList() {
      return Array.from(this.visitFunction).map(([name, visit]) => ({ name, visit }));
    },

    getVisitFunction(key) {
      return this.visitFunction.get(key);
    },

    async setVisitFunction(key) {
      const visitVal = this.getVisitFunction(key);
      if (isEmpty(visitVal)) {
        this.visitFunction.set(key, 1);
      } else {
        this.visitFunction.set(key, visitVal + 1);
      }
      this.saveVisitFunction()
    },

    async saveVisitFunction() {
      return await electronStore.set('userData.visitFunction', Object.fromEntries(this.visitFunction));
    },

    async addCollectMenu(item){
      this.collectMenus.add(item)
      return await this.saveCollectMenus;
    },

    async delCollectMenu(item){
      this.collectMenus.delete(item);
      return await this.saveCollectMenus;
    },

    getCollectMenus(){
      return [...this.collectMenus];
    }

  },
})

export default useUserCacheStore
