import { axios } from '@/utils/request'

const api = {
  queryPage: '/client_detail/query/page',
  queryAuthoritiesByCode: '/client_detail/query/authorities/code',
  save: '/client_detail/save',
  update: '/client_detail/update',
  delete: '/client_detail/delete/id'
}

export default api

export function queryClientDetailByPage (parameter) {
  return axios({
    url: api.queryPage,
    method: 'post',
    data: parameter
  })
}

export function queryClientAuthoritiesByCode (parameter) {
  return axios({
    url: api.queryAuthoritiesByCode,
    method: 'get',
    params: parameter
  })
}

export function saveClientDetail (parameter) {
  return axios({
    url: api.save,
    method: 'post',
    data: parameter
  })
}

export function deleteClientDetail (parameter) {
  return axios({
    url: api.delete,
    method: 'post',
    params: parameter
  })
}

export function updateClientDetail (parameter) {
  return axios({
    url: api.update,
    method: 'post',
    data: parameter
  })
}
