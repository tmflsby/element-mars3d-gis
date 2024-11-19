import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

import { vitePluginMars3d } from 'vite-plugin-mars3d'
import postCssPxToRem from 'postcss-pxtorem'

// https://vitejs.dev/config/
export default async () => {
  const UnoCSS = (await import('unocss/vite')).default
  return defineConfig({
    plugins: [
      vue(),
      vueDevTools(),
      vitePluginMars3d(),
      AutoImport({
        resolvers: [ElementPlusResolver()]
      }),
      Components({
        resolvers: [ElementPlusResolver()]
      }),
      UnoCSS()
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    css: {
      postcss: {
        plugins: [
          postCssPxToRem({
            rootValue: 192, // (屏幕分辨率宽度 / 缩放倍数 / 10)
            propList: ['*']
          })
        ]
      }
    },
    server: {
      proxy: {
        '/wpd-sanming': {
          target: 'https://web.cjwsjyszyh.com:1202/wpd-sanming', // 接口的域名
          secure: false, // 如果是https接口，需要配置这个参数
          changeOrigin: true, // 如果接口跨域，需要进行这个参数配置
          rewrite: (path) => path.replace(/^\/wpd-sanming/, '')
        },
        '^/geoserver': {
          target: 'https://web.cjwsjyszyh.com:1202/geoserver',
          secure: false, // 如果是https接口，需要配置这个参数
          changeOrigin: true, // 如果接口跨域，需要进行这个参数配置
          rewrite: (path) => path.replace(/^\/geoserver/, '')
        },
        '^/smsk3dtiles': {
          target: 'https://web.cjwsjyszyh.com:1202/smsk3dtiles',
          secure: false, // 如果是https接口，需要配置这个参数
          changeOrigin: true, // 如果接口跨域，需要进行这个参数配置
          rewrite: (path) => path.replace(/^\/smsk3dtiles/, '')
        },
        '^/weather': {
          target: 'http://175.44.138.53:5567',
          secure: false, // 如果是https接口，需要配置这个参数
          changeOrigin: true, // 如果接口跨域，需要进行这个参数配置
          rewrite: (path) => path.replace(/^\/weather/, '')
        },
        '^/ztq': {
          target: 'http://175.44.138.53:5566/api',
          secure: false, // 如果是https接口，需要配置这个参数
          changeOrigin: true, // 如果接口跨域，需要进行这个参数配置
          rewrite: (path) => path.replace(/^\/ztq/, '')
        },
        '^/smallWatershed': {
          target: 'https://web.cjwsjyszyh.com:1202/qicp',
          secure: false, // 如果是https接口，需要配置这个参数
          changeOrigin: true, // 如果接口跨域，需要进行这个参数配置
          rewrite: (path) => path.replace(/^\/smallWatershed/, '')
        }
      }
    }
  })
}
