const getters = {
  // sidebar: state => state.app.sidebar,
  // language: state => state.app.language,
  // device: state => state.app.device,
  userId: state => state.user.userId,
  classId: state => state.user.classId,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  role: state => state.user.role,
  introduction: state => state.user.introduction,
  status: state => state.user.status,
  roles: state => state.user.roles,
  menus: state => state.user.menus,
  urls: state => state.user.urls,
  setting: state => state.user.setting,
  // permission_routers: state => state.permission.routers,
  // addRouters: state => state.permission.addRouters,
  // privRouters: state => state.permission.privRouters,
  errorLogs: state => state.errorLog.logs,
  bubbleNum: state => state.user.bubbleNum
}
export default getters
