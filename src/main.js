import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

// 可伸缩布局方案
import 'amfe-flexible'

// normalize.css
import 'normalize.css'

// element-plus
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'

// element-plus icon
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

// dayjs
import 'dayjs/locale/zh-cn'

// mars3d
import 'mars3d-cesium/Build/Cesium/Widgets/widgets.css'
import * as Cesium from 'mars3d-cesium'
import 'mars3d/dist/mars3d.css'
import * as mars3d from 'mars3d'

import '@/styles/index.scss'

const app = createApp(App)

window.Cesium = Cesium
window.mars3d = mars3d
app.config.globalProperties.Cesium = Cesium
app.config.globalProperties.mars3d = mars3d

app.use(createPinia())
app.use(router)
app.use(ElementPlus, {
  locale: zhCn,
  size: 'large'
})
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.mount('#app')
