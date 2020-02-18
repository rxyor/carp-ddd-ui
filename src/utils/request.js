import Vue from 'vue'
import axios from 'axios'
import store from '@/store'
import notification from 'ant-design-vue/es/notification'
import router from '@/router'
import {
  VueAxios
} from './axios'
import {
  ACCESS_TOKEN
} from '@/store/mutation-types'

const service = axios.create({
  baseURL: '/api',
  timeout: 6000
})

// 错误处理
const err = (error) => {
  if (error.response) {
    const data = { status: 200, success: true, code: 200, msg: undefined }
    Object.assign(data, error.response.data, { status: error.response.status })

    if (data.status === 500) {
      notification.error({ message: '错误', description: '请求服务器失败' })
    } else if (data.status === 404) {
      notification.error({ message: '错误', description: '请求路径不存在' })
    } else if (data.status === 403) {
      console.error({ msg: '无权访问', err: data })
    } else if (data.status === 401) {
      console.error({ msg: '无权访问', err: data })
      const token = Vue.ls.get(ACCESS_TOKEN)
      if (token) {
        store.dispatch('Logout').then(() => {
          setTimeout(() => {
            window.location.reload()
          }, 1500)
        })
      }
    } else if (data.status !== 200) {
      console.error({ msg: '请求失败', err: data })
    }

    if (!data.success) {
      console.error({ msg: '业务请求失败', err: data })
      const msg = data.msg || '业务请求失败'
      notification.error({ message: '错误', description: msg })
      if (data.code === 401) {
        store.dispatch('Logout').then(() => {
          setTimeout(() => {
            window.location.reload()
          }, 1500)
        })
      }
    }
  }
  return Promise.reject(error)
}

// 请求拦截器
service.interceptors.request.use(config => {
  const token = Vue.ls.get(ACCESS_TOKEN)
  if (token) {
    // 写入Token
    config.headers['Authorization'] = 'Bearer ' + token
  }
  return config
}, err)

// 响应拦截器
service.interceptors.response.use((response) => {
  const data = { status: 200, success: true, code: 200, msg: undefined }
  Object.assign(data, response.data)
  if (!data.success) {
    return err({ response: response })
  }
  return response.data
}, err)

const installer = {
  vm: {},
  install (Vue) {
    Vue.use(VueAxios, service)
  }
}

export {
  installer as VueAxios,
  service as axios
}
