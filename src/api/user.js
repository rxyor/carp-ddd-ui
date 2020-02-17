import { axios } from '@/utils/request'

const api = {
  delete: '/user/delete/id',
  save: '/user/save',
  Update: '/ums/user/update',
  GetById: '/ums/user/get',
  Page: '/ums/user/page',
  Delete: '/ums/user/delete',
  Enable: '/ums/user/enable',
  Disable: '/ums/user/disable'
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

export function getUserList (parameter) {
  return axios({
    url: api.user,
    method: 'get',
    params: parameter
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

export function saveUser (parameter) {
  return axios({
    url: api.save,
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
