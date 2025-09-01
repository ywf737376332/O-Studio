<template>
    <div class="all-menu-container">
        <ul class="all-menu-pane">
            <li v-for="item in menuList" @click="routePage(item)">
                <div class="menu-item">
                    <p v-show="item.meta.noAuth" class="no-auth iconfont icon-no-auth"></p>
                    <p v-show="item.name === appInfoStore.activeMenu" class="active"></p>
                    <i :class="['iconfont', item.meta.icon]"></i>
                    <span>{{ item.meta.title }}</span>
                    <i :class="['iconfont', item.collectState === 0 ? 'icon-star collect' : 'icon-star cancel-collect']"
                        @click.prevent.stop="collectHandel(item)"></i>
                </div>
            </li>
        </ul>
    </div>
</template>

<script setup>
import routes from '@/router/routes/index';
import useAppInfoStore from '@/store/modules/appInfo'
import { isEmpty } from '@/utils'
import { computed } from 'vue';
import { useRouter } from 'vue-router'
import useUserCacheStore from '@/store/modules/userCache'

const userCacheStore = useUserCacheStore()
const router = useRouter()
const appInfoStore = useAppInfoStore();

// 页面跳转前关闭抽屉面板
const routePage = async (item) => {
    //路由跳转
    await router.push(item.path)
}

const collectMenus = computed(() => userCacheStore.getCollectMenus())
/**
 * 菜单排序，有权限的排在最前面，剩下的按照数组索引排序
 */
const menuList = computed(() => {
    // 先添收藏状态
    const routesCollectTag = routes.map(item => {
        const collectState = collectMenus.value.includes(item.name) ? 1 : 0
        return {
            ...item,
            collectState
        }
    })
    // 再给每个元素添加原始索引
    const routesWithIndex = routesCollectTag.map((item, index) => ({ ...item, originalIndex: index })).filter(item => isEmpty(item?.meta?.visible) || item?.meta?.visible);
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

const collectHandel = async (item) => {
    if (item?.collectState === 1) {
        await userCacheStore.delCollectMenu(item.name);
    } else if (item?.collectState === 0) {
        await userCacheStore.addCollectMenu(item.name);
    }
}

</script>

<style scoped lang="scss">
.all-menu-container {
    width: 100%;
    // height: calc(100vh - 55px);
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 15px 15px;
    box-sizing: border-box;
    overflow-y: auto;
    overflow-x: hidden;

    .all-menu-pane {
        width: 100%;
        height: auto;
        display: grid;
        grid-template-columns: repeat(6, 1fr);
        justify-content: flex-start;
        align-items: center;
        gap: 10px;
        /* 子元素之间的间距 */
        overflow-x: hidden;
        overflow-y: auto;

        >li {
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;

            .menu-item {
                width: 98px;
                aspect-ratio: 1/1;
                background-color: var(--main-btn-background-color);
                margin: 10px;
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
                    font-style: normal;
                }

                span {
                    margin-top: 12px;
                    font-size: 12px;
                    color: var(--main-btn-font-color);
                    text-align: center;
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

                .collect {
                    position: absolute;
                    top: 2px;
                    left: 3px;
                    font-style: normal;
                    font-size: 16px;
                    color: #f9e406;
                    display: inline;
                    opacity: 0;
                    transition: opacity 0.3s ease;
                    width: 20px;
                    height: 20px;

                    &:hover {
                        opacity: 1;
                    }
                }

                .cancel-collect {
                    position: absolute;
                    top: 2px;
                    left: 3px;
                    font-style: normal;
                    font-size: 16px;
                    color: #f9e406;
                    display: inline;
                    opacity: 1;
                    transition: opacity 0.3s ease;
                    width: 20px;
                    height: 20px;
                }
            }
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

@media (min-width: 1000px) and (max-width: 1200px) {
    .all-menu-container {

        .all-menu-pane {
            grid-template-columns: repeat(7, 1fr);

            >li {
                .menu-item {
                    width: 105px;
                }
            }
        }
    }
}

@media (min-width: 1201px) and (max-width: 1400px) {
    .all-menu-container {

        .all-menu-pane {
            grid-template-columns: repeat(8, 1fr);

            >li {
                .menu-item {
                    width: 115px;
                }
            }
        }
    }
}

@media (min-width: 1401px) and (max-width: 1600px) {
    .all-menu-container {

        .all-menu-pane {
            grid-template-columns: repeat(9, 1fr);

            >li {
                .menu-item {
                    width: 125px;
                }
            }
        }
    }
}

@media (min-width: 1601px) and (max-width: 1800px) {
    .all-menu-container {

        .all-menu-pane {
            grid-template-columns: repeat(10, 1fr);

            >li {
                .menu-item {
                    width: 135px;
                }
            }
        }
    }
}

@media (min-width: 1801px) and (max-width: 2000px) {
    .all-menu-container {

        .all-menu-pane {
            grid-template-columns: repeat(10, 1fr);

            >li {
                .menu-item {
                    width: 145px;
                }
            }
        }
    }
}

@media (min-width: 2001px) and (max-width: 2200px) {
    .all-menu-container {

        .all-menu-pane {
            grid-template-columns: repeat(10, 1fr);

            >li {
                .menu-item {
                    width: 155px;
                }
            }
        }
    }
}

@media (min-width: 2201px) {
    .all-menu-container {

        .all-menu-pane {
            grid-template-columns: repeat(10, 1fr);

            >li {
                .menu-item {
                    width: 165px;
                }
            }
        }
    }
}
</style>