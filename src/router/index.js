import { createRouter, createWebHistory } from 'vue-router'
import { getAccessToken, removeAccessToken } from '@/utils/token'
import AppLayout from '@/layout/AppLayout.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/main'
    },
    {
      path: '/main',
      name: 'AppMain',
      component: AppLayout,
      children: [
        {
          path: '/main',
          name: 'Main',
          component: () => import('@/layout/AppMain.vue')
        }
      ]
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/LoginView.vue')
    }
  ]
})

// 全局路由前置守卫
router.beforeEach((to, from, next) => {
  // console.log('全局路由前置守卫', to, from, next)

  const accessToken = getAccessToken()
  console.log('accessToken', accessToken)

  if (to.path === '/login') {
    removeAccessToken()
  }
  next()
})

export default router
