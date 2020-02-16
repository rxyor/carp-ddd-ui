import { axios } from '@/utils/request'

const api = {
  complexUserPage: '/user/page/complex_user',
  enable: '/user/enable/id',
  disable: '/user/disable/id',
  delete: '/user/delete/id',
  save: '/user/save',
  update: '/user/update'
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
