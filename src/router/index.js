import { createRouter, createWebHistory } from 'vue-router'
import { routerGuards } from '@/router/guards.js'

const baseUrlRes = fetch('/config/baseUrl.json').then((r) => r.json())
const layoutRes = fetch('/config/layout.json').then((r) => r.json())

await Promise.all([baseUrlRes, layoutRes]).then((res) => {
  window.baseUrl = res[0]
  window.layoutJson = res[1]
})

const routes = []

for (let i = 0; i < window.layoutJson.routes.length; i++) {
  const route = window.layoutJson.routes[i]
  routes.push({
    path: route.path,
    name: route.name,
    component: () => import('@/views/CommonView.vue'),
    meta: {
      title: route.title,
      panels: route.panels
    }
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
      component: () => import('@/layout/AppLayout.vue'),
      children: routes
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/LoginView.vue')
    }
  ]
})

export const setupRouter = (app) => {
  routerGuards(router)
  app.use(router)
}

export default router
