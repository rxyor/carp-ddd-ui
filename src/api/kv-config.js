import { axios } from '@/utils/request'

const api = {
  Page: '/ums/kvconfig/page',
  GetById: '/ums/kvconfig/get',
  FindByKeyAndAppId: '/ums/kvconfig/list/key',
  Save: '/ums/kvconfig/save',
  Update: '/ums/kvconfig/update',
  Delete: '/ums/kvconfig/delete'
}

export default api

export function kvConfigPage (parameter) {
  return axios({
    url: api.Page,
    method: 'post',
    data: parameter
  })
}

export function getKvConfigById (parameter) {
  return axios({
    url: api.GetById,
    method: 'get',
    params: parameter
  })
}

export function findByKeyAndAppId (parameter) {
  return axios({
    url: api.FindByKeyAndAppId,
    method: 'get',
    params: parameter
  })
}

export function saveKvConfig (parameter) {
  return axios({
    url: api.Save,
    method: 'post',
    data: parameter
  })
}

export function updateKvConfig (parameter) {
  return axios({
    url: api.Update,
    method: 'post',
    data: parameter
  })
}

export function deleteKvConfig (parameter) {
  return axios({
    url: api.Delete,
    method: 'post',
    params: parameter
  })
}
