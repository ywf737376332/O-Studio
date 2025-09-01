import { defineStore } from 'pinia'
import { affixRoute } from '@/utils'
const useAppInfoStore = defineStore('app-info', {
  state: () => ({
    winTitle: '',
    cursorPosLine: 0,
    cursorPosRow: 0,
    wordCounts: 0,
    languageType: '',
    activeMenu: ''
  }),
  getters: {},
  actions: {
    setWinState(item) {
      this.winTitle = item.title
      this.languageType = item.languageType
    },
    setWinTitle() {
      const routes = affixRoute()
      if (routes && routes.meta) {
        this.winTitle = routes.meta.title
      }
      return '首页'
    },
    setActiveMenu(item) {
      this.activeMenu = item.name
    },
    updateCursorPos(position) {
      this.cursorPosLine = position.lineNumber
      this.cursorPosRow = position.column
    },
    updateBarWords(num) {
      this.wordCounts = num
    },
    setWinDefaultState() {
      this.cursorPosLine = 0;
      this.cursorPosRow = 0;
      this.wordCounts = 0;
    }
  }
})

export default useAppInfoStore
