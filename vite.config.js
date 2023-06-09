import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

import { vitePluginMars3d } from 'vite-plugin-mars3d'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), vitePluginMars3d()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    proxy: {
      '/wpd-sanming': {
        target: 'http://175.44.138.53:1201/wpd-sanming', // 接口的域名
        secure: false, // 如果是https接口，需要配置这个参数
        changeOrigin: true, // 如果接口跨域，需要进行这个参数配置
        rewrite: (path) => path.replace(/^\/wpd-sanming/, '')
      },
      '^/geoserver': {
        target: 'http://175.44.138.53:1201/geoserver',
        secure: false, // 如果是https接口，需要配置这个参数
        changeOrigin: true, // 如果接口跨域，需要进行这个参数配置
        rewrite: (path) => path.replace(/^\/geoserver/, '')
      },
      '^/smsk3dtiles': {
        target: 'http://175.44.138.53:1201/smsk3dtiles',
        secure: false, // 如果是https接口，需要配置这个参数
        changeOrigin: true, // 如果接口跨域，需要进行这个参数配置
        rewrite: (path) => path.replace(/^\/smsk3dtiles/, '')
      }
    }
  }
})
