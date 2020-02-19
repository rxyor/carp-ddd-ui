import { axios } from '@/utils/request'

const api = {
  AppId: '/ums/option/app_id/list',
  Authority: '/ums/option/authority/list'
}

export default api

export function appIdOptions (parameter) {
  return axios({
    url: api.AppId,
    method: 'get',
    params: parameter
  })
}

export function authorityOptions (parameter) {
  return axios({
    url: api.AppId,
    method: 'get',
    params: parameter
  })
}
