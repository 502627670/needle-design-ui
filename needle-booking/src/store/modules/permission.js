import { constantRoutes, asyncRoutes, patternRoutes } from '@/router'
import Layout from '@/layout'

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  const res = []
  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })
  return res
}

const state = {
  routes: [],
  addRoutes: [],

  menus: [],
  viewPermissions: {}  // { name: uri }
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  },
  SET_MENUS: (state, menus) => {
    state.menus = menus || []
  },
  SET_VIEW_PERMISSIONS: (state, viewPermissions) => {
    state.viewPermissions = viewPermissions || []
  }
}

const actions = {
  generateRoutes({ commit, rootState  }, roles) {
    return new Promise(resolve => {
      // let accessedRoutes
      // if (roles.includes('admin')) {
      //   accessedRoutes = asyncRoutes || []
      // } else {
      //   accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
      // }

      let menus = rootState.permission.menus || []
      let viewPermissions = rootState.permission.viewPermissions || []
      let routesComponents = {}
      let accessedRoutes = getAccessRoutes(asyncRoutes, viewPermissions, routesComponents)
      // alert(routesComponents['/role'])
      accessedRoutes = accessedRoutes.concat(appendMenus(menus, routesComponents))
      accessedRoutes = accessedRoutes.concat(patternRoutes)
      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)
    })
  },

  setPermissions({ commit }, params) {
    let accessMenus = params.accessMenus || []
    let viewPermissions = params.viewPermissions || {}
    
    commit('SET_MENUS', accessMenus)
    commit('SET_VIEW_PERMISSIONS', viewPermissions)
  }
}

export function appendMenus(menus, routesComponents) {
  const res = []
  menus.forEach(menu => {
    let comp = routesComponents[menu.uri]
    const tmp = {
      path: menu.uri || '/', 
      component: comp ? comp : Layout,
      name: menu.name,
      meta: { title: menu.name, icon: menu.icon, keepAlive: false },
    }
    if(menu.children) {
      tmp.children = appendMenuChildren(menu.children, routesComponents)
    }
    res.push(tmp)
  })
  return res
}
export function appendMenuChildren(menuItems, routesComponents) {
  const res = []
  menuItems.forEach(menuItem => {
    let menuComponent = routesComponents[menuItem.uri]
    if(!menuComponent) {
      menuComponent = () => import('@/views/module/components/index')
    }
    const tmp = {
      path: menuItem.uri,
      component: menuComponent,
      name: menuItem.name,
      meta: { title: menuItem.name, icon: menuItem.icon, noCache: true, keepAlive: false },
    }
    res.push(tmp)
  })
  return res
}

export function getAccessRoutes(routes, viewPermissions, routesComponents) {
  const res = []
  routes.forEach(route => {
    const tmp = { ...route }
    let noHiddenChildren = []
    if (tmp.children) {
      tmp.children = getAccessRoutes(tmp.children, viewPermissions, routesComponents)
      noHiddenChildren = tmp.children.filter(child => !(child.hidden === true)) || []
    }
    let name = (route.meta ? route.meta.title : route.name) || ''
    routesComponents[tmp.path] = tmp.component
    if(noHiddenChildren.length > 0 || viewPermissions[name]) {
      res.push(tmp)
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
