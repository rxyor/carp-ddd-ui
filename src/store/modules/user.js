import Vue from 'vue'
import { login, logout, userInfo } from '@/api/login'
import { ACCESS_TOKEN, ACCESS_TOKEN_EXPIRED } from '@/store/mutation-types'
import { welcome } from '@/utils/util'

const user = {
  state: {
    token: '',
    name: '',
    welcome: '',
    avatar: '',
    permissions: [],
    info: undefined
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, { name, welcome }) => {
      state.name = name
      state.welcome = welcome
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_PERMISSIONS: (state, permissions) => {
      state.permissions = permissions
    },
    SET_INFO: (state, info) => {
      state.info = info
    }
  },

  actions: {
    // 登录
    Login ({ commit }, param) {
      return new Promise((resolve, reject) => {
        login(param).then(res => {
          const ret = { success: undefined, data: { access_token: undefined, refresh_token: undefined }, msg: undefined }
          Object.assign(ret, res)
          const accessToken = ret.data.access_token
          // 存储TOKEN到Cookie
          Vue.ls.set(ACCESS_TOKEN, accessToken, ACCESS_TOKEN_EXPIRED)
          commit('SET_TOKEN', accessToken)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    UserInfo ({ commit }) {
      return new Promise((resolve, reject) => {
        userInfo().then(res => {
          const ret = { success: undefined, data: { resources: [] }, msg: undefined }
          Object.assign(ret, res)
          const user = ret.data

          if (user.resources.length > 0) {
            commit('SET_PERMISSIONS', user.resources)
          }

          commit('SET_INFO', user)
          commit('SET_NAME', { name: user.nickname, welcome: welcome() })
          commit('SET_AVATAR', user.avatar)
          resolve(res)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 登出
    Logout ({ commit, state }) {
      return new Promise((resolve) => {
        logout().then((res) => {
          const ret = { success: undefined, msg: undefined, data: undefined }
          Object.assign(ret, res)
          if (ret.success) {
            commit('SET_TOKEN', '')
            commit('SET_INFO', undefined)
            Vue.ls.remove(ACCESS_TOKEN)
          } else {
            console.error(res)
          }
          resolve()
        }).catch(() => {
          commit('SET_TOKEN', '')
          commit('SET_INFO', undefined)
          Vue.ls.remove(ACCESS_TOKEN)
          resolve()
        })
      })
    },

    // 清除TOKEN
    ClearToken ({ commit, state }) {
      commit('SET_TOKEN', '')
      commit('SET_INFO', {})
      Vue.ls.remove(ACCESS_TOKEN)
    }

  }
}

export default user
