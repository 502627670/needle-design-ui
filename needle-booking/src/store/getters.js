const getters = {
  appName: state => state.app.name,
  appLogo: state => state.app.logo,
  sidebar: state => state.app.sidebar,
  size: state => state.app.size,
  fileHttpServer: state => state.app.fileHttpServer,
  device: state => state.app.device,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  username: state => state.user.name,
  introduction: state => state.user.introduction,
  roles: state => state.user.roles,
  permission_routes: state => state.permission.routes,
  menus: state => state.permission.menus,
  viewPermissions: state => state.permission.viewPermissions,
  errorLogs: state => state.errorLog.logs
}
export default getters
