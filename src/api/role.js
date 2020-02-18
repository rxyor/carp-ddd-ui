import { axios } from '@/utils/request'

const api = {
  Save: '/ums/role/save',
  Update: '/ums/role/update',
  GetById: '/ums/role/get',
  Page: '/ums/role/page',
  Delete: '/ums/role/delete',
  Disable: '/ums/role/disable',
  Enable: '/ums/role/enable'
}

export default api

export function rolePage (parameter) {
  return axios({
    url: api.Page,
    method: 'post',
    data: parameter
  })
}

export function getRoleById (parameter) {
  return axios({
    url: api.GetById,
    method: 'get',
    params: parameter
  })
}

export function enableRole (parameter) {
  return axios({
    url: api.Disable,
    method: 'post',
    params: parameter
  })
}

export function disableRole (parameter) {
  return axios({
    url: api.Disable,
    method: 'post',
    params: parameter
  })
}

export function deleteRole (parameter) {
  return axios({
    url: api.Delete,
    method: 'post',
    params: parameter
  })
}

export function saveRole (parameter) {
  return axios({
    url: api.Save,
    method: 'post',
    data: parameter
  })
}

export function updateRole (parameter) {
  return axios({
    url: api.Update,
    method: 'post',
    data: parameter
  })
}
