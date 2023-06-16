import { createRouter, createWebHistory } from 'vue-router'
import { getAccessToken, removeAccessToken } from '@/utils/token'
import AppLayout from '@/layout/AppLayout.vue'

await fetch('/config/layout.json')
  .then((r) => r.json())
  .then((r) => {
    window.layoutJson = r
  })

const routes = []

for (let i = 0; i < window.layoutJson.routes.length; i++) {
  const route = window.layoutJson.routes[i]
  routes.push({
    path: route.path,
    name: route.name,
    component: () => import('@/views/CommonView.vue')
  })
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: window.layoutJson.redirect
    },
    {
      path: '/',
      name: 'AppLayout',
      component: AppLayout,
      children: routes
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
