<template>
  <div class="often-use-func-container">
    <ul>
      <template v-for="(item, index) in oftenUseFuncList" :key="item.name">
        <li @click="linkTo(item)">
          <div class="item">
            <i :class="['iconfont', item.icon]"></i>
            <span>{{ item.title }}</span>
          </div>
        </li>
      </template>
      <template v-if="oftenUseFuncList.length === 0">
        <div style="font-size: 13px;">暂无任何使用记录</div>
      </template>
    </ul>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import routes from '@/router/routes'
import { useRouter } from 'vue-router'
import useUserCacheStore from '@/store/modules/userCache'

const userCacheStore = useUserCacheStore()
const router = useRouter()

/**
 * 收藏菜单列表
 */
const collectMenus = computed(()=>userCacheStore.getCollectMenus())
const oftenUseFuncList = computed(() => {
  return collectMenus.value
    .map((item) => {
      const match = routes.find((route) => route.name === item)
      if (match) {
        return {
          name: match.name,
          title: match.meta.title,
          icon: match.meta.icon
        }
      }
      return item
    })
})

// 这段代码是根据使用频率去统计的
// const funcListStore = computed(() => userCacheStore.getVisitFunctionList())

// const oftenUseFuncList = computed(() => {
//   return funcListStore.value
//     .map((item) => {
//       const match = routes.find((route) => route.name === item.name)
//       if (match) {
//         return {
//           ...item,
//           title: match.meta.title,
//           icon: match.meta.icon
//         }
//       }
//       return item
//     })
//     .sort((a, b) => b.visit - a.visit)
// })

const linkTo = async (item) => {
  await router.push({ name: item.name })
}
</script>

<style scoped lang="scss">
.often-use-func-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  overflow-x: auto;
  overflow-y: hidden;
  box-sizing: border-box;

  >ul {
    height: 95px;
    display: flex;
    flex-direction: row;
    align-items: center;

    >li {
      width: 80px;
      height: 80px;
      background-color: var(--main-btn-background-color);
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 5px;
      margin: 0 10px 0 10px;

      .item {
        width: 80px;
        height: 80px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        box-sizing: border-box;
        cursor: pointer;

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

      }

      &:hover {
        background-color: var(--main-btn-active-color);
      }
    }
  }
}
</style>
