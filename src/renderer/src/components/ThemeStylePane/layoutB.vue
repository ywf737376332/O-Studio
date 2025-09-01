<template>
  <div class="theme-style-item">
    <div class="theme-main-container">
      <div class="theme-main-header"></div>
      <div class="theme-main-content"></div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
</script>

<style scoped lang="scss">
.theme-style-item {
  width: 100%;
  height: 100%;
  padding: 4px;
  background-color: var(--main-theme-background-color);
  box-shadow:
    0 1px 3px 0 var(--main-theme-border-h-shadow),
    0 0 3px 0 var(--main-theme-border-v-shadow);
  border-radius: 2px;
  overflow: hidden;
  cursor: pointer;

  .theme-main-container {
    width: 100%;
    height: 100%;
    position: relative;
    .theme-main-header {
      width: 100%;
      height: 20%;
      background-color: var(--main-theme-header-background-color);
      position: absolute;
      top: 0;
      right: 0;
    }
    .theme-main-content {
      width: 100%;
      height: 75%;
      background-color: var(--main-theme-content-background-color);
      position: absolute;
      bottom: 0;
      right: 0;
    }
  }
}
</style>
