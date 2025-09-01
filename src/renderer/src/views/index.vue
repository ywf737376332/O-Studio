<template>
  <Layout>
    <template #container>
        <router-view v-slot="{ Component }">
          <transition name="fade-transform" mode="out-in">
            <keep-alive :include="tagsViewStore.cachedViews">
              <component :is="Component" ref="componentRef" :key="route.path"></component>
            </keep-alive>
          </transition>
        </router-view>
    </template>
  </Layout>
</template>

<script setup>

import { useRoute } from 'vue-router';
import Layout from '@/layout/index.vue'
import useTagsViewStore from '@/store/modules/tagsView'
const tagsViewStore = useTagsViewStore();
const route = useRoute();
</script>


<style scoped lang="scss">
.fade-transform--move,
.fade-transform-leave-active,
.fade-transform-enter-active {
  transition: all .5s;
}

.fade-transform-enter {
  opacity: 0;
  transform: translateX(-30px);
}

.fade-transform-leave-to {
  opacity: 0;
  transform: translateX(30px);
}</style>