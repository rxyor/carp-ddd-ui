import { axios } from '@/utils/request'

const api = {
  complexUserPage: '/user/page/complex_user',
  enable: '/user/enable/id',
  disable: '/user/disable/id',
  delete: '/user/delete/id',
  user: '/user',
  role: '/role',
  service: '/service',
  permission: '/permission',
  permissionNoPager: '/permission/no-pager',
  orgTree: '/org/tree'
}

export default api

export function getUserList (parameter) {
  return axios({
    url: api.user,
    method: 'get',
    params: parameter
  })
}

export function getComplexUserByPage (parameter) {
  return axios({
    url: api.complexUserPage,
    method: 'post',
    data: parameter
  })
}

export function enableUser (parameter) {
  return axios({
    url: api.enable,
    method: 'post',
    params: parameter
  })
}

export function disableUser (parameter) {
  return axios({
    url: api.disable,
    method: 'post',
    params: parameter
  })
}

export function deleteUser (parameter) {
  return axios({
    url: api.delete,
    method: 'post',
    params: parameter
  })
}

export function getRoleList (parameter) {
  return axios({
    url: api.role,
    method: 'get',
    params: parameter
  })
}

export function getServiceList (parameter) {
  return axios({
    url: api.service,
    method: 'get',
    params: parameter
  })
}

export function getPermissions (parameter) {
  return axios({
    url: api.permissionNoPager,
    method: 'get',
    params: parameter
  })
}

export function getOrgTree (parameter) {
  return axios({
    url: api.orgTree,
    method: 'get',
    params: parameter
  })
}

// id == 0 add     post
// id != 0 update  put
export function saveService (parameter) {
  return axios({
    url: api.service,
    method: parameter.id === 0 ? 'post' : 'put',
    data: parameter
  })
}
