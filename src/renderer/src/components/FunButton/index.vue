<template>
    <div class="btn-pane" @click="fnClick">
        <i :class="['iconfont', ico]"></i>
        <span>{{ text }}</span>
    </div>
</template>

<script setup>
const props = defineProps({
    ico: {
        type: String,
        default: ''
    },
    text: {
        type: String,
        default: ''
    }
})

const emit = defineEmits(['fnClick'])
const fnClick = () => {
    emit('fnClick')
}
</script>

<style scoped lang="scss">
.btn-pane {
    display: flex;
    align-items: center;
    flex-direction: row;
    justify-content: center;
    width: auto;
    height: 23px;
    color: var(--main-btn-font-color);
    background-color: var(--main-btn-background-color);
    padding: 0 8px;
    border-radius: 3px;
    cursor: pointer;

    span {
        font-size: 12px;
        white-space: nowrap;
        /* 防止文本换行 */
        overflow: hidden;
        /* 隐藏超出容器的内容 */
        text-overflow: ellipsis;
        /* 使用省略号表示溢出的文本 */
    }

    .iconfont {
        font-size: 16px;
        margin-right: 5px;
    }

    &:hover {
        background-color: var(--main-btn-active-color);
    }
}
</style>