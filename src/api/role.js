import { axios } from '@/utils/request'

const api = {
  listAllEnable: '/role/list/all/enable',
  insertBatchRelationByUserId: '/role/insert/relation/batch/user_id',
  deleteBatchRelationByUserId: '/role/delete/relation/batch/user_id',
  complexRolePage: '/role/page/complex_role',
  enable: '/role/enable/id',
  disable: '/role/disable/id',
  delete: '/role/delete/id',
  save: '/role/save',
  Page: '/ums/role/page',
  Delete: '/ums/role/delete',
  Disable: '/ums/role/disable',
  Enable: '/ums/role/enable',
  update: '/role/update'
}

export default api

export function listAllEnableRoles () {
  return axios({
    url: api.listAllEnable,
    method: 'get'
  })
}

export function insertBatchUserRoleRelationByUserId (params) {
  return axios({
    url: api.insertBatchRelationByUserId,
    method: 'post',
    data: params
  })
}

export function deleteBatchUserRoleRelationByUserId (params) {
  return axios({
    url: api.deleteBatchRelationByUserId,
    method: 'post',
    data: params
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
    url: api.save,
    method: 'post',
    data: parameter
  })
}

export function updateRole (parameter) {
  return axios({
    url: api.update,
    method: 'post',
    data: parameter
  })
}
