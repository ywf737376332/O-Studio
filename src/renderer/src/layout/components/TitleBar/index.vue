<template>
    <div class="title drag">{{ title }}</div>
</template>

<script setup>
defineProps({
    title: {
        type: String,
        default: ''
    }
})
</script>

<style scoped lang="scss">
.title {
    width: 100%; // 占父组件的所有宽度，父组件是right-container,宽度已减去左侧边栏
    height: 30px;
    line-height: 30px;
    font-size: 14px;
    font-weight: 500;
    text-align: center;
    letter-spacing: 2px;
    color: var(--main-header-tagsview-font-color);
    background-color: var(--main-header-tagsview-background-color);
}
</style>