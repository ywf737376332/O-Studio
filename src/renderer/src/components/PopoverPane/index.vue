<template>
    <div class="main-pane">
        <el-popover :width="width" popper-class="popover-pane" trigger="click" :visible="visible" placement="bottom-end" transition="el-zoom-in-left">
            <template #reference>
                <FunButton :ico="menuIco" :text="menuName" @fnClick="handelClick"/>
            </template>
            <template #default>
                <div style="display: flex; flex-direction: column; justify-content: space-around;">
                    <slot name="container"></slot>
                </div>
            </template>
        </el-popover>
    </div>
</template>

<script setup>
import FunButton from '@/components/FunButton/index.vue'

const props = defineProps({
    width: {
        type: Number,
        default: 50
    },
    menuName: {
        type: String,
        default: ''
    },
    menuIco: {
        type: String,
        default: ''
    },
    visible: {
        type: Boolean,
        default: false
    }
})

const emit = defineEmits(['handelClick'])
const handelClick = ()=>{
    emit('handelClick')
}

</script>

<style scoped lang="scss">
.main-pane {
    display: flex;
    flex-direction: row;
    align-items: center;
    width: auto;
    height: auto;

    .popover-pane {
        box-shadow: rgb(14 18 22 / 35%) 0px 10px 38px -10px, rgb(14 18 22 / 20%) 0px 10px 20px -15px;
        padding: 20px;
    }
}
</style>