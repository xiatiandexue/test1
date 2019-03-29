import { loginByUsername, logout} from '@/commons/api/user'
import { getToken, setToken, removeToken, getName, setName, removeName, getTime, setTime, getRole } from '@/commons/utils/auth'
const user = {
  state: {
    user: '',
    status: '',
    code: '',
    token: getToken(),
    name: getName(),
    logintime: getTime(),
    role: getRole(),
    avatar: '',
    introduction: '',
    roles: [],
    menus: [],
    urls: [],
    setting: {
      articlePlatform: []
    },
    showBubble: false,
    bubbleNum: 0
  },

  mutations: {
    SET_CODE: (state, code) => {
      state.code = code
    },
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_ROLE: (state, role) => {
      state.role = role
    },
    SET_INTRODUCTION: (state, introduction) => {
      state.introduction = introduction
    },
    SET_SETTING: (state, setting) => {
      state.setting = setting
    },
    SET_STATUS: (state, status) => {
      state.status = status
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
    SET_MENUS: (state, menus) => {
      state.menus = menus
    },
    SET_URLS: (state, urls) => {
      state.urls = urls
    },
    ADD_URL: (state, url) => {
      state.urls.push(url)
    },
    SET_PRIVROUTERS: (state, routers) => {
      state.menus = routers
    },
    SET_SHOWBUBBLE: (state, flag) => {
      state.showBubble = flag
    },
    SET_BubbleNum: (state, num) => {
      state.bubbleNum = num
    },
    // SET_ACCOUNT: (state, account) => {
    //   state.account = account
    // }
    SET_TIME: (state, logintime) => {
      state.time = logintime
    }
  },

  actions: {
    // 用户名登录
    LoginByUsername ({ commit }, userInfo) {
      const usercode = userInfo.usercode
      const role = userInfo.role
      return new Promise((resolve, reject) => {
        loginByUsername(usercode, userInfo.password,role).then(response => {
          if (response.code === -2) {
            reject(response)
          }
          const data = response.data
          console.log(data)
          var time = new Date()
          commit('SET_TOKEN', usercode)
          commit('SET_NAME', data.name)
          commit('SET_ROLE', role)
          commit('SET_TIME', time)
          setToken(usercode)
          setName(data.name)
          setRole(role)
          setTime(time)

          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    addAccessRight ({commit}, url) {
      return new Promise((resolve, reject) => {
        commit('ADD_URL', url)
        resolve(this.state.urls)
      })
    },
    
    

    // 登出
    LogOut ({ commit, state }) {
      return new Promise((resolve, reject) => {
        
          commit('SET_TOKEN', '')
          commit('SET_ROLE', '')
          commit('SET_MENUS', [])
          commit('SET_URLS', [])
          commit('SET_PRIVROUTERS', [])
          removeToken()
          removeName()
          resolve()
       
      })
    },
    // 登出
    GetBubble ({ commit, state }) {
      return new Promise((resolve, reject) => {
        emergency.bubbleEmergencyEvent().then(res => {
          commit('SET_BubbleNum', res.data)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 前端 登出
    FedLogOut ({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        commit('SET_ROLE', '')
        commit('SET_MENUS', [])
        commit('SET_URLS', [])
        commit('SET_PRIVROUTERS', [])
        removeToken()
        removeName()
        resolve()
      })
    },

    
  }
}

export default user
