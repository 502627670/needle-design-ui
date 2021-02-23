import Cookies from 'js-cookie'
import { getAppInfo } from '@/api/example'

const state = {
  sidebar: {
    opened: Cookies.get('sidebarStatus') ? !!+Cookies.get('sidebarStatus') : true,
    withoutAnimation: false
  },
  device: 'desktop',
  size: Cookies.get('size') || 'small',
  fileHttpServer: '',
  name: Cookies.get('appname'),
  logo: Cookies.get('logo'),
}

const mutations = {
  TOGGLE_SIDEBAR: state => {
    state.sidebar.opened = !state.sidebar.opened
    state.sidebar.withoutAnimation = false
    if (state.sidebar.opened) {
      Cookies.set('sidebarStatus', 1)
    } else {
      Cookies.set('sidebarStatus', 0)
    }
  },
  CLOSE_SIDEBAR: (state, withoutAnimation) => {
    Cookies.set('sidebarStatus', 0)
    state.sidebar.opened = false
    state.sidebar.withoutAnimation = withoutAnimation
  },
  TOGGLE_DEVICE: (state, device) => {
    state.device = device
  },
  SET_SIZE: (state, size) => {
    state.size = size
    Cookies.set('size', size)
  },
  SET_FILE_HTTP_SERVER: (state, fileHttpServer) => {
    state.fileHttpServer = fileHttpServer
  },
  SET_APP_NAME: (state, name) => {
    state.name = name
    Cookies.set('appname', name)
  },
  SET_APP_LOGO: (state, logo) => {
    state.logo = logo
    Cookies.set('logo', logo)
  },
}

const actions = {
  toggleSideBar({ commit }) {
    commit('TOGGLE_SIDEBAR')
  },
  closeSideBar({ commit }, { withoutAnimation }) {
    commit('CLOSE_SIDEBAR', withoutAnimation)
  },
  toggleDevice({ commit }, device) {
    commit('TOGGLE_DEVICE', device)
  },
  setSize({ commit }, size) {
    commit('SET_SIZE', size)
  },
  setFileHttpServer({ commit }, fileHttpServer) {
    commit('SET_FILE_HTTP_SERVER', fileHttpServer)
  },
  getAppInfo({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      getAppInfo({}).then(response => {
        commit('SET_APP_NAME', response.data.name)
        commit('SET_APP_LOGO', response.data.logo)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
