import { createApp } from 'vue'
import { setupPlugins } from '@/plugins'
import { setupStores } from '@/stores'
import { setupRouter } from '@/router'

import App from '@/App.vue'
const app = createApp(App)

setupPlugins(app)
setupStores(app)
setupRouter(app)

app.mount('#app')
