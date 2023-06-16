import axios from 'axios'
import qs from 'qs'
import { ElMessage } from 'element-plus'
import { getAccessToken, removeAccessToken } from '@/utils/token'
import router from '@/router'

const service = axios.create({})

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    // 判断是否传入authorization
    let authorization = config.headers.authorization
    let token = getAccessToken()
    if (token && !authorization) {
      config.headers['Authorization'] = 'Bearer ' + token // token
    } else {
      config.headers['Authorization'] = 'Basic d3BkOndwZA==' // token
    }

    if (config.method === 'get') {
      config.paramsSerializer = function (params) {
        return qs.stringify(params, { arrayFormat: 'repeat' })
      }
    }
    if (config.method === 'post') {
      config.paramsSerializer = function (params) {
        return qs.stringify(params, { arrayFormat: 'repeat' })
      }
    }

    return config
  },
  (error) => {
    console.log(error)
  }
)

service.interceptors.response.use(
  (response) => {
    // console.log(response.status)
    if (response.status === 200) {
      return response.data
    }
  },
  (error) => {
    console.log('err:', error)
    if (error.response.status === 400 || error.response.status === 401) {
      ElMessage.error(`没有权限，请重新登录`)
      removeAccessToken()
      router.push('/login').catch((err) => err)
      return error.response
    }
    return error.response
  }
)

export default service
