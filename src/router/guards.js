import { removeAccessToken } from '@/utils/storage'

export const routerGuards = (router) => {
  // 全局路由前置守卫
  router.beforeEach(async (to, from, next) => {
    // console.log('全局路由前置守卫', to, from, next)
    if (to.path === '/login') {
      removeAccessToken()
    }
    next()
  })
}
