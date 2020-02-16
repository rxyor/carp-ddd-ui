import { axios } from '@/utils/request'

const api = {
  // 登录
  Login: '/oauth2/token/access',
  // 登出
  Logout: '/oauth2/token/remove',
  // 用户信息
  UserInfo: '/oauth2/user'
}

export default api

/**
 *登录接口
 *
 * @param parameter
 * @returns {AxiosPromise}
 */
export function login (parameter) {
  return axios({
    url: api.Login,
    method: 'post',
    params: parameter,
    // http basic
    auth: {
      username: 'carp',
      password: 'carp'
    }
  })
}

export function logout () {
  return axios({
    url: api.Logout,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function userInfo () {
  return axios({
    url: api.UserInfo,
    method: 'get',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
