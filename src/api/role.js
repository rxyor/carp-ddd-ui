import { axios } from '@/utils/request'

const api = {
  GetById: '/ums/role/get',
  GetWithPermissionsById: '/ums/role/get/with_permissions',
  ListEnable: '/ums/role/list/enable',
  Page: '/ums/role/page',
  Save: '/ums/role/save',
  Update: '/ums/role/update',
  Delete: '/ums/role/delete',
  Disable: '/ums/role/disable',
  Enable: '/ums/role/enable',
  Alloc: '/ums/role/alloc'
}

export default api

export function getRoleById (parameter) {
  return axios({
    url: api.GetById,
    method: 'get',
    params: parameter
  })
}

export function getRoleWithPermissionsById (parameter) {
  return axios({
    url: api.GetWithPermissionsById,
    method: 'get',
    params: parameter
  })
}

export function listEnableRoles (parameter) {
  return axios({
    url: api.ListEnable,
    method: 'get',
    params: parameter
  })
}

export function rolePage (parameter) {
  return axios({
    url: api.Page,
    method: 'post',
    data: parameter
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

export function allocPermissions (parameter) {
  return axios({
    url: api.Alloc,
    method: 'post',
    data: parameter
  })
}
