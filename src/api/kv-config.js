import { axios } from '@/utils/request'

const api = {
  queryPage: '/kv_config/query/page',
  listAllType: '/kv_config/list/all/type',
  listByType: '/kv_config/list/type',
  delete: '/kv_config/delete/id',
  save: '/kv_config/save',
  update: '/kv_config/update'
}

export default api

export function queryKvConfigByPage (parameter) {
  return axios({
    url: api.queryPage,
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

export function deleteKvConfig (parameter) {
  return axios({
    url: api.delete,
    method: 'post',
    params: parameter
  })
}

export function saveKvConfig (parameter) {
  return axios({
    url: api.save,
    method: 'post',
    data: parameter
  })
}

export function updateKvConfig (parameter) {
  return axios({
    url: api.update,
    method: 'post',
    data: parameter
  })
}
