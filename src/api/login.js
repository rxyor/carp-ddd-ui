import { axios } from '@/utils/request'

const api = {
  UserInfo: '/user/info',
  // 登录接口
  login: '/oauth2/token/access',
  logout: '/oauth/token/remove'
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
    url: api.login,
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
    url: api.logout,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function getInfo () {
  return axios({
    url: '/user/info',
    method: 'get',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
