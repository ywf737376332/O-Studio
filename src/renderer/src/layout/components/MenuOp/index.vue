<template>
  <div class="win-operate-container no-drag" v-if="showWinBar">
    <div class="win-menu-pane" v-if="!showSideBar">
      <template v-for="item in menuList" :key="item.name">
        <div :class="['iconfont', item.icon]" @click="handelClickMenu(item.name)"></div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { isElectron } from '@/utils/electron'
import useSettingStore from '@/store/modules/settings'
import { menuList } from '@/config/sideBarMenuList'

const settingStore = useSettingStore()
const showSideBar = computed(() => settingStore.getShowSideBar())

// 根据环境决定是否显示窗口栏
const showWinBar = computed(() => isElectron())

const emit = defineEmits(['handelClickMenu'])

const handelClickMenu = (val) => {
  emit('handelClickMenu', val)
}

const themeColor = computed(() => settingStore.getThemeColor())
</script>

<style lang="scss" scoped>
.win-operate-container {
  top: 4px;
  left: 0px;
  position: absolute;
  z-index: 1;
  overflow: hidden;
  border-radius: 0 3px 0 0;
  display: flex;
  flex-direction: row;

  .iconfont {
    float: left;
    font-size: 12px;
    text-align: center;
    display: flex;
    justify-content: center;
    cursor: pointer;
    height: 25px;
    align-items: center;
    padding: 0 10px;
    color: var(--main-win-btn-font-color);

    &:hover {
      background: var(--main-win-btn-active-color);
    }
  }

  .win-menu-pane {
    margin-right: 20px;
    .iconfont {
      margin-right: 6px;
      &:hover {
        background: v-bind(themeColor);
        color: var(--main-win-close-btn-active-font-color);
      }
    }
  }
}
</style>
