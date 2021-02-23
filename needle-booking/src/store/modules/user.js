// import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken, removeAppname } from '@/utils/auth'
import router, { resetRouter } from '@/router'

import { loginByUsername, getUserInfo, logout } from '@/api/login'
import { asyncRoutes, constantRoutes } from '@/router'

const state = {
  token: getToken(),
  name: '',
  avatar: '',
  introduction: '',
  roles: [],
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password, rememberMe } = userInfo
    return new Promise((resolve, reject) => {
      loginByUsername({ 
        username: username.trim(), 
        password: password,
        rememberMe: rememberMe
      }).then(response => {
        const { data } = response
        commit('SET_TOKEN', data.token)
        setToken(data.token)
        resolve(response)
      }).catch(error => {
        reject(error)
      })

      // login({ username: username.trim(), password: password }).then(response => {
      //   const { data } = response
      //   commit('SET_TOKEN', data.token)
      //   setToken(data.token)
      //   resolve()
      // }).catch(error => {
      //   reject(error)
      // })
    })
  },

  // get user info
  getInfo({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      getUserInfo(state.token).then(response => {
        const { data } = response
        
        if (!data) {
          reject('Verification failed, please Login again.')
        }
        const { roles, username, avatar, introduction, 
          accessMenus, viewPermissions, fileHttpServer 
        } = data
        
        // roles must be a non-empty array
        if (!roles || roles.length <= 0) {
          reject('用户还没有分配角色')
        }

        commit('SET_ROLES', roles)
        commit('SET_NAME', username)
        commit('SET_AVATAR', avatar)
        commit('SET_INTRODUCTION', introduction)

        dispatch('app/setFileHttpServer', fileHttpServer, { root: true })
       
        let params = {
          accessMenus: accessMenus,
          viewPermissions: viewPermissions
        }

        if(username === 'administrator') {
          let allPermissions = {}
          getAllRoutes(asyncRoutes).forEach(route => {
            let name = route.meta ? route.meta.title : route.name
            allPermissions[name] = route.uri
          })
          // getAllRoutes(accessMenus).forEach(menu => {
          //   allPermissions[menu.name] = menu.uri
          // })
          params.viewPermissions = allPermissions
        }
        dispatch('permission/setPermissions', params, { root: true })

        resolve(data)
      }).catch(error => {
        reject(error)
      })

      // getInfo(state.token).then(response => {
      //   const { data } = response

      //   if (!data) {
      //     reject('Verification failed, please Login again.')
      //   }

      //   const { roles, name, avatar, introduction } = data

      //   // roles must be a non-empty array
      //   if (!roles || roles.length <= 0) {
      //     reject('getInfo: roles must be a non-null array!')
      //   }

      //   commit('SET_ROLES', roles)
      //   commit('SET_NAME', name)
      //   commit('SET_AVATAR', avatar)
      //   commit('SET_INTRODUCTION', introduction)
      //   resolve(data)
      // }).catch(error => {
      //   reject(error)
      // })
    })
  },

  // user logout
  logout({ commit, state, dispatch }) {
    // dispatch('app/getAppInfo', null, { root: true })

    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        removeToken()
        resetRouter()
        
        // reset visited views and cached views
        // to fixed https://github.com/PanJiaChen/vue-element-admin/issues/2485
        dispatch('tagsView/delAllViews', null, { root: true })

        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      resolve()
    })
  },

  // dynamically modify permissions
  async changeRoles({ commit, dispatch }, role) {
    const token = role + '-token'

    commit('SET_TOKEN', token)
    setToken(token)

    const { roles } = await dispatch('getInfo')

    resetRouter()

    // generate accessible routes map based on roles
    const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })
    // dynamically add accessible routes
    router.addRoutes(accessRoutes)

    // reset visited views and cached views
    dispatch('tagsView/delAllViews', null, { root: true })
  }
}

function getAllRoutes(routes) {
  let res = []
  routes.forEach((route) => {
    let tmp = { 
      name: route.meta ? route.meta.title : route.name,
      uri: route.path
    }
    res.push(tmp)
    if(route.children) {
      let children = getAllRoutes(route.children)
      res = res.concat(children)
    }
  })
  return res
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
