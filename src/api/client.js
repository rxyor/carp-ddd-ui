import { axios } from '@/utils/request'

const api = {
  Page: '/ums/client/page',
  GetById: '/ums/client/get',
  Save: '/ums/client/save',
  Update: '/ums/client/update',
  Delete: '/ums/client/delete'
}

export default api

export function clientPage (parameter) {
  return axios({
    url: api.Page,
    method: 'post',
    data: parameter
  })
}

export function getClientById (parameter) {
  return axios({
    url: api.GetById,
    method: 'get',
    params: parameter
  })
}

export function saveClient (parameter) {
  return axios({
    url: api.Save,
    method: 'post',
    data: parameter
  })
}

export function updateClient (parameter) {
  return axios({
    url: api.Update,
    method: 'post',
    data: parameter
  })
}

export function deleteClient (parameter) {
  return axios({
    url: api.Delete,
    method: 'post',
    params: parameter
  })
}
