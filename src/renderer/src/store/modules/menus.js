import { defineStore } from 'pinia'
import { electronStore } from '@/utils/electronStore'
import { isEmpty } from '@/utils'
import routes from '@/router/routes/index';

const useUserMenusStore = defineStore('user-menus', {
  state: () => ({
    viewMenus: new Set(),
    hideMenus: new Set()
  }),
  getters: {
    async getStoreViewMenus() {
      return (await electronStore.get('userMenus.viewMenus')) ?? []
    },
    async getLocalAllMenus() {
      return routes.filter(item => item.meta?.visible === undefined || item.meta.visible).map(item => item.name)
    },
    async saveViewMenus() {
      electronStore.set('userMenus.viewMenus', [...this.viewMenus]);
    },
    async getStoreHideMenus() {
      return await electronStore.get('userMenus.hideMenus')
    },
    async saveHideMenus() {
      electronStore.set('userMenus.hideMenus', [...this.hideMenus]);
    },
  },
  actions: {
    async initMenusData() {
      try {
        const cacheViewMenus = await this.getStoreViewMenus;
        const localMenus = await this.getLocalAllMenus;
        if (isEmpty(cacheViewMenus) || cacheViewMenus.length === 0) {
          this.viewMenus = new Set(localMenus)
        } else {
          this.viewMenus = new Set(cacheViewMenus)
        }
        // 隐藏的菜单列表
        if (isEmpty(cacheViewMenus) || cacheViewMenus.length === 0) {
          this.hideMenus = []
        } else {
          this.hideMenus = localMenus.map(route => {
            const match = cacheViewMenus.find(item => item === route)
            if (!match) {
              return route
            }
          })
        }
      } catch (error) {
        Logger.error("初始化本地【user-menus】数据到Pinia失败")
      }
    },

    /**
     * 显示的菜单列表
     */
    getViewMenuList() {
      return [...this.viewMenus]
    },

    async setViewMenuList(menu) {
      this.viewMenus = new Set(menu)
      await this.saveViewMenus;
    },

    /**
     * 隐藏的菜单列表
     */
    getHideMenuList() {
      if (this.hideMenus) {
        return [...this.hideMenus]
      }
      return []
    },

    async setHideMenuList(menu) {
      this.hideMenus = new Set(menu)
      await this.saveHideMenus;
    },


  },
})

export default useUserMenusStore
