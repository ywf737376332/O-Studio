<template>
    <div class="menu-container no-drag" :style="{ 'width': width + '%' }">
        <div class="left-menu">
            <template v-for="item in funMenuList" :key="item.menuName">
                <FunButton class="fun-btn" @fnClick="item.menuFun(item)" :ico="item.menuIco" :text="item.menuName"
                    v-if="item.position === 'left'" />
            </template>
        </div>
        <div class="right-menu">
            <template v-for="item in funMenuList">
                <FunButton class="fun-btn" @fnClick="item.menuFun(item)" :ico="item.menuIco" :text="item.menuName"
                    v-if="item.position === 'right'" />
            </template>
        </div>
    </div>
</template>

<script setup>
import FunButton from '@/components/FunButton/index.vue'
defineProps({
    width: {
        type: Number,
        default: 100
    },
    funMenuList: {
        type: Array,
        required: true
    }
})
</script>

<style scoped lang="scss">
.menu-container {
    height: auto;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    //margin: 15px 0 8px 0;
    padding: 15px 20px 8px 20px;
    .left-menu {
        margin-right: 20px;
    }

    >div {
        display: flex;
        flex-direction: row;
    }

    .fun-btn:not(:last-of-type) {
        margin-right: 20px;
    }
}
</style>