import { axios } from '@/utils/request'

const api = {
  GetById: '/ums/user/get',
  GetWithRolesById: '/ums/user/get/with_roles',
  Page: '/ums/user/page',
  Save: '/ums/user/save',
  Update: '/ums/user/update',
  Delete: '/ums/user/delete',
  Enable: '/ums/user/enable',
  Disable: '/ums/user/disable',
  Alloc: '/ums/user/alloc'
}

export default api

export function userPage (parameter) {
  return axios({
    url: api.Page,
    method: 'post',
    data: parameter
  })
}

export function getUserById (parameter) {
  return axios({
    url: api.GetById,
    method: 'get',
    params: parameter
  })
}

export function getUserWithRolesById (parameter) {
  return axios({
    url: api.GetWithRolesById,
    method: 'get',
    params: parameter
  })
}

export function saveUser (parameter) {
  return axios({
    url: api.Save,
    method: 'post',
    data: parameter
  })
}

export function updateUser (parameter) {
  return axios({
    url: api.Update,
    method: 'post',
    data: parameter
  })
}

export function enableUser (parameter) {
  return axios({
    url: api.Enable,
    method: 'post',
    params: parameter
  })
}

export function disableUser (parameter) {
  return axios({
    url: api.Disable,
    method: 'post',
    params: parameter
  })
}

export function deleteUser (parameter) {
  return axios({
    url: api.Delete,
    method: 'post',
    params: parameter
  })
}

export function allocRoles (parameter) {
  return axios({
    url: api.Alloc,
    method: 'post',
    data: parameter
  })
}
