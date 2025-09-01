<template>
    <!-- 右侧展开抽屉 -->
    <DrawerViewer :showDrawer="showDrawer" :title="`全部菜单`" :size="60" @handleClose="handleClose">
        <template #main>
            <ul class="drawer-container no-drag">
                <li v-for="item in menuList" @click="routePage(item)">
                    <div class="menu-item">
                        <p v-show="item.meta.noAuth" class="no-auth iconfont icon-no-auth"></p>
                        <p v-show="item.name === appInfoStore.activeMenu" class="active"></p>
                        <i :class="['iconfont', item.meta.icon]"></i>
                        <span>{{ item.meta.title }}</span>
                    </div>
                </li>
            </ul>
        </template>
    </DrawerViewer>
</template>

<script setup>
import routes from '@/router/routes/index';
import DrawerViewer from '@/components/DrawerViewer/index.vue'
import useAppInfoStore from '@/store/modules/appInfo'
import { computed } from 'vue';
const appInfoStore = useAppInfoStore();
const props = defineProps({
    showDrawer: {
        type: Boolean,
        default: true
    }
})
const emit = defineEmits(['handleClose', 'routePage'])
const handleClose = () => {
    emit('handleClose')
}

/**
 * 菜单排序，有权限的排在最前面，剩下的按照数组索引排序
 */
const menuList = computed(() => {
    // 先给每个元素添加原始索引
    const routesWithIndex = routes.map((item, index) => ({ ...item, originalIndex: index }));
    // 然后排序
    routesWithIndex.sort((a, b) => {
        // 获取 noAuth 值，如果不存在则默认为 false
        const aNoAuth = a.meta?.noAuth ?? false;
        const bNoAuth = b.meta?.noAuth ?? false;
        // 如果 noAuth 值不同，按 noAuth 排序
        if (aNoAuth !== bNoAuth) {
            return aNoAuth - bNoAuth; // noAuth: true 的排在前面
        }
        // 如果 noAuth 值相同，按原始索引排序
        return a.originalIndex - b.originalIndex;
    });
    // 移除添加的 originalIndex
    return routesWithIndex.map(({ originalIndex, ...item }) => item);
})

const routePage = (item) => {
    emit('routePage', item)
}

</script>

<style scoped lang="scss">
.drawer-container {
    width: 100%;
    height: auto;
    display: grid;
    grid-template-columns: repeat(4, 1fr);

    .menu-item {
        min-width: 100px;
        max-width: 120px;
        aspect-ratio: 1/1;
        background-color: var(--main-btn-background-color);
        margin: 8px;
        padding: 8px;
        border-radius: 5px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        position: relative;

        .iconfont {
          font-size: 24px;
          color: var(--main-btn-font-color);
          display: flex;
          flex-direction: column;
          justify-content:flex-start;
          align-items: center;
          text-align: center;
          width: 100%;
          height: 40px;
          line-height: 50px;
        }

        >span {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          text-align: center;
          width: 100%;
          height: 40px;
          font-size: 11px;
          color: var(--main-btn-font-color);
          /* 防止文本换行 */
          overflow: hidden;
          /* 使用省略号表示溢出的文本 */
          text-overflow: ellipsis;
          /* 限制最多显示两行 */
          -webkit-line-clamp: 2;
          /* 控制显示的行数 */
          -webkit-box-orient: vertical;
          line-clamp: 2;
          /* 标准属性，部分浏览器支持 */
          box-orient: vertical;
          /* 标准属性，部分浏览器支持 */
        }

        &:hover {
            background-color: var(--main-btn-active-color);
        }

        .no-auth {
            position: absolute;
            top: 0;
            right: 0;
            font-size: 38px;
            opacity: .5;
        }

        .icon-no-auth {
            color: #F98A00;
        }

        .active {
            position: absolute;
            top: 6px;
            left: 6px;
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background: var(--main-menu-active-color);
            box-shadow: 0 0 0 0 rgba(0, 255, 0, 1);
            animation: breathing-shadow 1s infinite;
        }
    }
}

@keyframes breathing-shadow {
    0% {
        transform: scale(0.95);
        box-shadow: 0 0 0 0 rgba(0, 255, 0, 0.7);
    }
    70% {
        transform: scale(1);
        box-shadow: 0 0 0 10px rgba(0, 255, 0, 0);
    }
    100% {
        transform: scale(0.95);
        box-shadow: 0 0 0 0 rgba(0, 255, 0, 0);
    }
}

@media (max-width: 850px) {
    .drawer-container {
        .menu-item {
            min-width: 80px;
        }
    }
}

@media (min-width: 1000px) and (max-width: 1250px) {
    .drawer-container {
        grid-template-columns: repeat(5, 1fr);
    }
}

@media (min-width: 1251px) and (max-width: 1700px) {
    .drawer-container {
        grid-template-columns: repeat(6, 1fr);
    }
}
@media (min-width: 1701px) and (max-width: 2100px) {
    .drawer-container {
        grid-template-columns: repeat(8, 1fr);
    }
}
@media (min-width: 2101px){
    .drawer-container {
        grid-template-columns: repeat(10, 1fr);
    }
}
</style>