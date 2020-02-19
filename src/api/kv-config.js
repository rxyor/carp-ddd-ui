import { axios } from '@/utils/request'

const api = {
  Page: '/ums/kvconfig/page',
  Save: '/ums/kvconfig/save',
  Update: '/ums/kvconfig/update',
  Delete: '/ums/kvconfig/delete',
  listAllType: '/kv_config/list/all/type',
  listByType: '/kv_config/list/type'
}

export default api

export function kvConfigPage (parameter) {
  return axios({
    url: api.Page,
    method: 'post',
    data: parameter
  })
}

export function listAllKvConfigType () {
  return axios({
    url: api.listAllType,
    method: 'get'
  })
}
export function listKvConfigByType (parameter) {
  return axios({
    url: api.listByType,
    method: 'get',
    params: parameter
  })
}

export function saveKvConfig (parameter) {
  return axios({
    url: api.Save,
    method: 'post',
    data: parameter
  })
}

export function updateKvConfig (parameter) {
  return axios({
    url: api.Update,
    method: 'post',
    data: parameter
  })
}

export function deleteKvConfig (parameter) {
  return axios({
    url: api.Delete,
    method: 'post',
    params: parameter
  })
}
