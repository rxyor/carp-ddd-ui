import { axios } from '@/utils/request'

const api = {
  delete: '/user/delete/id',
  save: '/user/save',
  update: '/user/update',
  Page: '/ums/user/page',
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
    url: api.delete,
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
    url: api.update,
    method: 'post',
    data: parameter
  })
}
