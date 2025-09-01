<template>
    <div class="tags-view-container">
        <p class="tags-btn"></p>
        <ScrollPane ref="scrollPaneRef" class="tags-view-wrapper">
            <router-link v-for="tag in visitedViews" :key="tag.path" :data-path="tag.path" :to="{ path: tag.path }"
                tag="span" class="tags-view-item" :class="isActive(tag) ? 'active' : ''" :style="activeStyle(tag)">
                {{ tag.meta.title }}
                <!-- 这个地方一定要click加个stop阻止，不然会因为事件冒泡一直触发父元素的点击事件，无法跳转另一个路由 -->
                <span v-if="!isAffix(tag)" class="iconfont icon-close tag-close"
                    @click.prevent.stop="closeSelectedTag(tag)" />
            </router-link>
        </ScrollPane>
        <p class="tags-btn"></p>
    </div>
</template>

<script setup>
import { ref, onMounted, computed, watch, nextTick, getCurrentInstance } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import useTagsViewStore from '@/store/modules/tagsView';
import useAppInfoStore from '@/store/modules/appInfo'
import ScrollPane from './ScrollPane.vue';
import routes from '@/router/routes/index';
import useSettingStore from '@/store/modules/settings'
const settingStore = useSettingStore()

const { proxy } = getCurrentInstance();
const route = useRoute();
const router = useRouter();
const scrollPaneRef = ref(null);
const tagsViewStore = useTagsViewStore();
const appInfoStore = useAppInfoStore();

const themeColor = computed(()=>settingStore.getThemeColor())

const visitedViews = computed(() => {
    return tagsViewStore.visitedViews
})

const isActive = (tag) => {
    return tag.path === route.path
}
const activeStyle = (tag) => {
    if (!isActive(tag)) return {};
    //const mainMenuActiveColor = getRootStyleValue('--main-menu-active-color');
    return {
        "border-bottom": `3px solid ${themeColor.value}`
    }
}

// 是否固定，不显示关闭图标
const isAffix = (tag) => {
    return tag.meta && tag.meta.affix
}

// 关闭标签
const closeSelectedTag = (tag) => {
    tagsViewStore.delView(tag).then(({ visitedViews }) => {
        if (isActive(tag)) {
            toLastView(visitedViews, tag)
        }
    })
}

//找到最后面的一个标签
const toLastView = (visitedViews, view) => {
    const latestView = visitedViews.slice(-1)[0]
    if (latestView) {
        router.push(latestView.path)
    } else {
        // now the default is to redirect to the home page if there is no tags-view,
        // you can adjust it according to your needs.
        if (view.name === 'Home') {
            // to reload home page
            router.replace({ path: '/home' + view.path })
        } else {
            router.push('/')
        }
    }
}

const filterAffixTags = (routeList) => {
    return routeList.filter(route => route.meta && route.meta.affix);
}
// 初始化固定标签到pinia
const initTags = () => {
    const affixRoutes = filterAffixTags(routes);
    if (affixRoutes && affixRoutes.length > 0) {
        for (const tag of affixRoutes) {
            if (tag.name) {
                tagsViewStore.addView(tag)
            }
        }
    }
}

/**
 * 添加路由标签
 * 添加缓存路由
 */
function addTags() {
    const { name } = route
    if (name) {
        tagsViewStore.addView(route)
    }
    return false
}

const moveToCurrentTag = () => {
    nextTick(() => {
        for (const r of visitedViews.value) {
            if (r.path === route.path) {
                scrollPaneRef.value.moveToTarget(r);
            }
        }
    })
}
// 改变标题 状态栏
const updateAppInfo = () => {
    const { meta } = route
    if (meta) {
        appInfoStore.setWinState(meta);
    }
    appInfoStore.setActiveMenu(route)
    // 路由跳转时,重置状态栏
    appInfoStore.setWinDefaultState();
    return false
}

watch(route, () => {
    addTags()
    moveToCurrentTag()
    // 改变窗体状态
    updateAppInfo();
})

onMounted(() => {
    initTags();
    addTags();
    // 改变窗体状态
    updateAppInfo();
})
</script>

<style scoped lang="scss">
.tags-view-container {
    height: 30px;
    //height: 34px;
    width: 100%;
    background-color: var(--main-header-tagsview-background-color);
    border-bottom: 1px solid var(--main-border-color);
    // box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12), 0 0 3px 0 rgba(0, 0, 0, 0.04);
    display: flex;
    flex-direction: row;
    align-items: center;

    .tags-btn {
        margin: 0 5px;
    }

    .tags-view-wrapper {
        .tags-view-item {
            display: inline-block;
            position: relative;
            cursor: pointer;
            height: 25px;
            line-height: 24px;
            box-sizing: border-box;
            //border: 1px solid #d8dce5;
            color: var(--main-header-tagsview-font-color);
            background-color: var(--main-header-tagsview-background-color);
            padding: 0 8px;
            font-size: 12px;
            //margin-left: 5px;
            margin-top: 4px;

            &:first-of-type {
                margin-left: 8px;
            }

            &:last-of-type {
                margin-right: 8px;
            }

            &.active {
                color: v-bind(themeColor);
                //border-color: #d8dce5;
                //border-bottom: 1px solid #FFF;
                border-bottom: 3px solid var(--main-menu-active-color);

                // 激活后，菜单前面加蓝点
                // &::before {
                //     content: '';
                //     background: #409EFF;
                //     display: inline-block;
                //     width: 8px;
                //     height: 8px;
                //     text-align: center;
                //     border-radius: 50%;
                //     position: relative;
                //     margin-right: 2px;
                // }
            }

            .iconfont {
                font-size: 12px;
                vertical-align: -1px;
            }

            .tag-close {
                width: 16px;
                height: 16px;
                // vertical-align: 2px;
                border-radius: 50%;
                text-align: center;
                transition: all .3s cubic-bezier(.645, .045, .355, 1);
                transform-origin: 100% 50%;

                &:before {
                    transform: scale(.6);
                    display: inline-block;
                }

                &:hover {
                    background-color: #b4bccc;
                    color: #fff;
                }
            }
        }
    }
}
</style>