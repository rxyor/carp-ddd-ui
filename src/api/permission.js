import { axios } from '@/utils/request'

const api = {
  GetById: '/ums/permission/get',
  Page: '/ums/permission/page',
  ListEnable: '/ums/permission/list/enable',
  Save: '/ums/permission/save',
  Update: '/ums/permission/update',
  Delete: '/ums/permission/delete',
  Disable: '/ums/permission/disable',
  Enable: '/ums/permission/enable'
}

export default api

export function getPermissionById (parameter) {
  return axios({
    url: api.GetById,
    method: 'get',
    params: parameter
  })
}

export function listEnablePermissions (parameter) {
  return axios({
    url: api.ListEnable,
    method: 'get',
    params: parameter
  })
}

export function permissionPage (parameter) {
  return axios({
    url: api.Page,
    method: 'post',
    data: parameter
  })
}

export function enablePermission (parameter) {
  return axios({
    url: api.Disable,
    method: 'post',
    params: parameter
  })
}

export function disablePermission (parameter) {
  return axios({
    url: api.Disable,
    method: 'post',
    params: parameter
  })
}

export function deletePermission (parameter) {
  return axios({
    url: api.Delete,
    method: 'post',
    params: parameter
  })
}

export function savePermission (parameter) {
  return axios({
    url: api.Save,
    method: 'post',
    data: parameter
  })
}

export function updatePermission (parameter) {
  return axios({
    url: api.Update,
    method: 'post',
    data: parameter
  })
}
