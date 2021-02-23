import request from '@/utils/request'

// let baseUri = 'http://localhost:8080/'
let baseUri = ''
export function loginByUsername(query) {
  let url = baseUri + '/login'
  return request({
    url: url,
    method: 'post',
    params: query
  })
}
export function logout() {
  let url = baseUri + '/logout'
  return request({
    url: url,
    method: 'post'
  })
}
export function getUserInfo(token) {
  let url = baseUri + '/user/getUserInfo'
  return request({
    url: url,
    method: 'get',
    params: { token }
  })
}