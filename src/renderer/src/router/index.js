import { createRouter, createWebHashHistory } from 'vue-router'
import { affixRoute } from '@/utils'
import { Notification } from '@/utils/message'
import routes from './routes'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'Index',
      redirect: () => {
        return redirectRoute()
      },
      component: () => import('@/views/index.vue'),
      children: routes
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.meta.noAuth) {
    Notification({
      title: '未授权提醒',
      message: '当前功能暂未开放，尽请期待！',
      type: 'warning'
    })
    return
  } else {
    next()
  }
})

router.afterEach((to, from) => {
  // 路由跳转后执行，比如做一些埋点统计
  Logger.info('离开的页面-->', from.meta.title)
  Logger.info('进入的页面-->', to.meta.title)
})

/**
 * 返回固定页面路由
 */
const redirectRoute = () => {
  const routes = affixRoute()
  if (routes) {
    return routes.path
  }
  return '/home'
}

export default router
