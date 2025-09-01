<template>
  <div class="left-sider">
    <div class="menu-list-top">
      <div class="avatar">
        <el-avatar shape="square" :size="avatar.size" fit="cover" :src="getImageUrl(avatar.url)" />
      </div>
      <template v-for="item in menuList" :key="item.name">
        <div :class="['tab-item iconfont', item.icon, currentMenu.name === item.name ? 'active' : '']" v-if="item.position == 'top'" @click="changeMenu(item)">
        </div>
      </template>
    </div>
    <div class="menu-list-bottom">
      <template v-for="item in menuList">
        <div :class="['tab-item iconfont', item.icon, currentMenu.name === item.name ? 'active' : '']" v-if="item.position == 'bottom'"
          @click="changeMenu(item)">
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue';
import { getImageUrl } from '@/utils';
import { menuList } from '@/config/sideBarMenuList'
import avatarImage from '@/assets/images/avatar.jpg';
import useSettingStore from '@/store/modules/settings'
const settingStore = useSettingStore()

const currentMenu = ref(menuList[0])
const emit = defineEmits(['changeMenu']);
const changeMenu = (item) => {
  emit('changeMenu', item)
  currentMenu.value = item
}

const siderBarBgColor = computed(() => settingStore.getSideBarColor())
const themeColor = computed(() => settingStore.getThemeColor())
const avatar = reactive({ size: 30, url: avatarImage })

</script>

<style scoped lang="scss">
.left-sider {
  width: 45px;
  background-color: v-bind(siderBarBgColor);
  height: calc(100% - 1px);
  flex-shrink: 0;
  display: flex;
  align-items: center;
  flex-direction: column;

  .menu-list-top {
    flex: 1;
    display: flex;
    align-items: center;
    flex-direction: column;
  }

  .menu-list-bottom {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    flex-direction: column;
  }

  .iconfont {
    font-size: 20px;
    color: #999;
  }

  .avatar {
    width: 40px;
    height: 40px;
    text-align: center;
    margin-top: 10px;
    cursor: pointer;
  }

  .tab-item {
    width: 40px;
    height: 40px;
    text-align: center;
    margin-top: 20px;
    cursor: pointer;

    &:hover {
      color: #b3b3b3;
    }
  }

  .active {
    color: v-bind(themeColor);
  }
}
</style>