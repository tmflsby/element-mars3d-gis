import axios from 'axios'
import qs from 'qs'
import { ElMessage } from 'element-plus'
import { getAccessToken, removeAccessToken } from '@/utils/storage'
import { removeLocalStorage } from '@/utils/storage'
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
      config.paramsSerializer = {
        serialize: (params) => qs.stringify(params, { arrayFormat: 'repeat' })
      }
    }
    if (config.method === 'post') {
      config.paramsSerializer = {
        serialize: (params) => qs.stringify(params, { arrayFormat: 'repeat' })
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
    // console.log('response:', response)
    if (response.data instanceof Blob) {
      response.data = {
        data: response.data,
        headers: response.headers
      }
    }

    if (response.status === 200) {
      return response.data
    }
  },
  (error) => {
    console.log('err:', error)
    if (error.response.status === 401) {
      ElMessage.error(`没有权限，请重新登录`)
      removeAccessToken()
      removeLocalStorage('selectedDept')
      router.push('/login').catch((err) => err)
      return error.response
    }
    return error.response
  }
)

export default service
