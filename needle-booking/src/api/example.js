import qs from 'qs'
import request from '@/utils/request'

export const RULE_ID = 1 << 0
export const REQUIRED = 1 << 1
export const NO_CREATE = 1 << 2
export const NO_UPDATE = 1 << 3
export const HIDE_LIST = 1 << 4
export const HIDE_FORM = 1 << 5
export const HIDE_EDIT = 1 << 6
export const HIDE_INFO = 1 << 7
export const TRANSIENT = 1 << 8
export const SHOW_IN_ROW = 1 << 9
export const ABSOLUTE_FILE = 1 << 10
export const AUDIT_CREATED_BY = 1 << 12
export const AUDIT_CREATED_DATE = 1 << 13
export const AUDIT_LAST_MODIFIED_BY = 1 << 14
export const AUDIT_LAST_MODIFIED_DATE = 1 << 15
export const SECURITY_GROUP = 1 << 16
export const SYSTEM_FIELD = 1 << 17

export function isID(ruleType) {
  return (ruleType & RULE_ID) == RULE_ID
}
export function isSystemProp(ruleType) {
  return (ruleType & SYSTEM_FIELD) === SYSTEM_FIELD || 
    (ruleType & SECURITY_GROUP) === SECURITY_GROUP
}
export function isRequired(ruleType) {
  return (ruleType & REQUIRED) == REQUIRED
}
export function isNoUpdate(ruleType) {
  return (ruleType & NO_UPDATE) == NO_UPDATE
}
export function isAuditProp(ruleType) {
  if((ruleType & AUDIT_CREATED_BY) === AUDIT_CREATED_BY) {
    return true
  }
  else if((ruleType & AUDIT_CREATED_DATE) === AUDIT_CREATED_DATE) {
    return true
  }
  else if((ruleType & AUDIT_LAST_MODIFIED_BY) === AUDIT_LAST_MODIFIED_BY) {
    return true
  }
  else if((ruleType & AUDIT_LAST_MODIFIED_DATE) === AUDIT_LAST_MODIFIED_DATE) {
    return true
  }
  return false
}
export function isImportProp(ruleType) {
  return !isID(ruleType) && !isAuditProp(ruleType) && 
    (SYSTEM_FIELD & ruleType) !== SYSTEM_FIELD
}
export function isHideInList(ruleType) {
  // return isID(ruleType) || isAuditProp(ruleType) ||
  //   (ruleType & HIDE_LIST) == HIDE_LIST || 
  //   (SYSTEM_FIELD & ruleType) === SYSTEM_FIELD
  return isAuditProp(ruleType) ||
    (ruleType & HIDE_LIST) == HIDE_LIST || 
    (SYSTEM_FIELD & ruleType) === SYSTEM_FIELD
}
export function isHideInForm(ruleType) {
  return isID(ruleType) ||
    (ruleType & HIDE_FORM) == HIDE_FORM || 
    (SYSTEM_FIELD & ruleType) === SYSTEM_FIELD
}
export function isHideInEdit(ruleType) {
  return isID(ruleType) ||
    (ruleType & HIDE_EDIT) == HIDE_EDIT || 
    (SYSTEM_FIELD & ruleType) === SYSTEM_FIELD
}
export function isHideInInfo(ruleType) {
  return isID(ruleType) ||
    (ruleType & HIDE_INFO) === HIDE_INFO || 
    (SYSTEM_FIELD & ruleType) === SYSTEM_FIELD
}
export function isListProp(ruleType) {
  return (SECURITY_GROUP & ruleType) !== SECURITY_GROUP && !isAuditProp(ruleType) && 
    (SYSTEM_FIELD & ruleType) != SYSTEM_FIELD && !isID(ruleType) && !isHideInList(ruleType)
}
export function isAbsoluteFile(ruleType) {
  return (ruleType & ABSOLUTE_FILE) == ABSOLUTE_FILE
}
export function isShowInRow(moduleProp) {
  return (moduleProp.ruleType & SHOW_IN_ROW) === SHOW_IN_ROW
}


export function columnMinWidth(length) {
  if(length <= 4)  return 24 * length
  else if(length > 4 && length <= 10) return length * 15
  else if(length > 10 && length < 14) return length * 11
  else if(length >= 14 && length < 16) return length * 12
  else if(length >= 16 && length < 36) return length * 11
  else if(length >= 36) return length * 8
}

// let baseUri = "http://localhost:8080/data/"

let baseUri = '/data/'

export function getBaseUri() {
  let baseURL = process.env.VUE_APP_BASE_API
  let url = baseURL
  if(baseURL.endsWith("/")) {
    url = baseURL.substring(0, baseURL.length - 1)
  }
  console.log('getBaseUri=' + url)
  return url
}

export function getFileUploadAction() {
  // let baseURL = process.env.VUE_APP_BASE_API
  // let url = baseURL
  // if(baseURL.endsWith("/")) {
  //   url = baseURL.substring(0, baseURL.length - 1)
  // }
  let url = getBaseUri()
  return url + "/file/upload.json"
}

export function getEditorUploadAction() {
  let url = getBaseUri()
  return url + '/file/upload.json'
}

export function getAppInfo() {
  let url = getBaseUri() + '/app.json'
  console.log('getAppInfo(..) => url=' + url)
  return request({
    url: url,
    method: 'get',
    params: {},
    paramsSerializer: params => {
      return qs.stringify(params, { allowDots: true })
    }
  })
}

export function getEntity(module, id) {
  let url = baseUri + module + '/get?id=' + id
  return request({
    url: url,
    method: 'post',
    params: {},
    paramsSerializer: params => {
      return qs.stringify(params, { allowDots: true })
    }
  })
}

export function findList(module, query) {
  let url = baseUri + module + '/list'
  return request({
    url: url,
    method: 'post',
    params: query,
    paramsSerializer: params => {
      return qs.stringify(params, { allowDots: true })
    }
  })
}

export function create(module, query) {
  let url = baseUri + module + '/create'
  return request({
    url: url,
    method: 'post',
    params: query,
    paramsSerializer: params => {
      return qs.stringify(params, { allowDots: true })
    }
  })
}

export function update(module, query) {
  let url = baseUri + module + '/update'
  return request({
    url: url,
    method: 'post',
    params: query,
    paramsSerializer: params => {
      return qs.stringify(params, { allowDots: true })
    }
  })
}

export function remove(module, query) {
  let url = baseUri + module + '/remove'
  return request({
    url: url,
    method: 'post',
    params: query,
    paramsSerializer: params => {
      return qs.stringify(params, { indices: false })
    }
  })
}

export function execute(action, query) {
  let url = getBaseUri() + action.uri
  return request({
    url: url,
    method: 'post',
    params: query,
    paramsSerializer: params => {
      return qs.stringify(params, { indices: false })
    }
  })
}

export function preview(module, query) {
  let url = baseUri + module + '/preview'
  return request({
    url: url,
    method: 'post',
    params: query,
    paramsSerializer: params => {
      return qs.stringify(params, { indices: false, allowDots: true })
    }
  })
}

export function saveImport(module, query) {
  let url = baseUri + module + '/saveImport'
  return request({
    url: url,
    method: 'post',
    params: query,
    paramsSerializer: params => {
      return qs.stringify(params, { indices: false, allowDots: true })
    }
  })
}

export function removeFile(query) {
  let url = '/file/remove.json'
  return request({
    url: url,
    method: 'post',
    params: query,
    paramsSerializer: params => {
      return qs.stringify(params, { indices: false })
    }
  })
}

export function findTaskModules(module, query) {
  let url = baseUri + 'task/modules'
  return request({
    url: url,
    method: 'post',
    params: query,
    paramsSerializer: params => {
      return qs.stringify(params, { allowDots: true })
    }
  })
}
export function getTaskModule(module, query) {
  let url = baseUri + 'task/module'
  return request({
    url: url,
    method: 'post',
    params: query,
    paramsSerializer: params => {
      return qs.stringify(params, { allowDots: true })
    }
  })
}

export function findTaskNexts(module, query) {
  let url = baseUri + 'task/nexts'
  return request({
    url: url,
    method: 'post',
    params: query,
    paramsSerializer: params => {
      return qs.stringify(params, { allowDots: true })
    }
  })
}

export function openUri(uri) {
  let url = getBaseUri() + uri
  window.open(url, '_blank')
}