import { axios } from '@/utils/request'

const api = {
  listAllEnable: '/permission/list/all/enable',
  queryPage: '/permission/query/page',
  insertBatchRelationByUserId: '/permission/insert/relation/batch/role_id',
  deleteBatchRelationByUserId: '/permission/delete/relation/batch/role_id',
  enable: '/permission/enable/id',
  disable: '/permission/disable/id',
  delete: '/permission/delete/id',
  save: '/permission/save',
  update: '/permission/update'
}

export default api

export function listAllEnablePermissions () {
  return axios({
    url: api.listAllEnable,
    method: 'get'
  })
}

export function insertBatchRolePermissionRelationByRoleId (params) {
  return axios({
    url: api.insertBatchRelationByUserId,
    method: 'post',
    data: params
  })
}

export function deleteBatchRolePermissionRelationByRoleId (params) {
  return axios({
    url: api.deleteBatchRelationByUserId,
    method: 'post',
    data: params
  })
}

export function enablePermission (parameter) {
  return axios({
    url: api.enable,
    method: 'post',
    params: parameter
  })
}

export function disablePermission (parameter) {
  return axios({
    url: api.disable,
    method: 'post',
    params: parameter
  })
}

export function deletePermission (parameter) {
  return axios({
    url: api.delete,
    method: 'post',
    params: parameter
  })
}

export function savePermission (parameter) {
  return axios({
    url: api.save,
    method: 'post',
    data: parameter
  })
}

export function updatePermission (parameter) {
  return axios({
    url: api.update,
    method: 'post',
    data: parameter
  })
}

export function queryPermissionByPage (parameter) {
  return axios({
    url: api.queryPage,
    method: 'post',
    data: parameter
  })
}
