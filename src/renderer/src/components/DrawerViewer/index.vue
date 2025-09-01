<template>
    <div class="menu-drawer-container no-drag">
        <el-drawer :model-value="showDrawer" :title="title" :with-header="withHeader" :size="size + '%'" :direction="direction" 
        :close-on-click-modal="true" :close-on-press-escape="pressEscOnClose"
            @open="openBeforeEvent" :show-close="showClose" :destroy-on-close="true" :before-close="handleClose">
            <h4 v-show="!withHeader">{{ title }}</h4>
            <slot name="main" class="drawer-content"></slot>
            <template #footer>
                <slot name="bottom"></slot>
            </template>
        </el-drawer>
    </div>
</template>

<script setup>
defineProps({
    showDrawer: {
        type: Boolean,
        default: true
    },
    title: {
        type: String,
        default: ''
    },
    size: {
        type: Number,
        default: '10'
    },
    withHeader: {
        type: Boolean,
        default: false
    },
    showClose: {
        type: Boolean,
        default: false
    },
    direction: {
        type: String,
        default: 'rtl'
    },
    pressEscOnClose: {
        type: Boolean,
        default: true
    },
})

const emit = defineEmits(['handleClose','openBeforeEvent'])
const handleClose = () => {
    emit('handleClose')
}
const openBeforeEvent = ()=>{
    emit('openBeforeEvent')
}
</script>

<style scoped lang="scss">
.menu-drawer-container {
    h4 {
        margin: 10px 10px;
        color: var(--main-btn-font-color);
    }

    :deep(.el-drawer.rtl) {
        box-sizing: border-box;
        border-right: 1.6px solid var(--main-border-color);
        border-top: 1px solid var(--main-border-color);
        border-bottom: 1px solid var(--main-border-color);
        border-left: 1px solid var(--main-border-color);
    }

    .drawer-content {
        flex: 1;
        overflow: auto;
    }

    /* 修改抽屉内容区域的布局 */
    :deep(.el-drawer__body) {
        height: 100%;
        padding: 5px 10px 10px 10px;
        display: flex;
        flex-direction: column;
        border-top: 1px solid var(--main-border-color);
        border-bottom: 1px solid var(--main-border-color);
    }
}
</style>