<template>
  <div class="theme-layout-list">
    <template v-for="item in themeList">
      <div class="layout-item" :class="val === item.themeName ? 'active-item' : ''"
        @click="handelLayout(item.themeName)">
        <template v-if="item.themeName === 'layoutA'">
          <layoutA />
        </template>
        <template v-else="item.themeName === 'layoutB'">
          <layoutB />
        </template>
      </div>
    </template>
  </div>
</template>

<script setup>
import layoutA from './layoutA.vue'
import layoutB from './layoutB.vue'
import { computed } from 'vue';
import useSettingStore from '@/store/modules/settings'
const settingStore = useSettingStore()

const props = defineProps({
  val: {
        type: String,
        dafault: ''
    }
})

const emit = defineEmits(['handelLayout','update:val'])
const handelLayout = (val) => {
  emit('update:val', val)
  emit('handelLayout', val)
}

const themeList = [
  {
    themeName: 'layoutA',
    descript: '左右布局'
  },
  {
    themeName: 'layoutB',
    descript: '上下布局'
  }
]
const themeColor = computed(()=>settingStore.getThemeColor())

</script>

<style scoped lang="scss">
.theme-layout-list {
  // width: 100%;
  width: auto;
  display: flex;
  align-items: center;

  .layout-item {
    width: 68px;
    height: 50px;
    position: relative;

    &.active-item {
      border: 3px solid v-bind(themeColor);
      border-radius: 3px;
    }
  }

  .layout-item:not(:last-child) {
    margin-right: 25px;
  }
}</style>
