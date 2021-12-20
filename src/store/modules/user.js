import {login, getInfo} from '@/api/login'
import {Message} from 'element-ui';

const user = {
  state: {
    token: '',
    name: '',
    avatar: '',
    role: ''
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_ROLE: (state, role) => {
      state.role = role
    }
  },

  actions: {
    // 登录
    Login({commit}, userInfo) {
      const userName = userInfo.username.trim()
      return new Promise((resolve, reject) => {
        login(userName, userInfo.password).then(response => {
          if (response.status === 200) {
            console.log(response)
            const token = response.data.data
            commit('SET_TOKEN', token)
            localStorage.token = token
            localStorage.username = userName
            localStorage.logInAgain = 'false'
            getInfo(token).then(res => {
              console.log(res.data.data)
              localStorage.role = res.data.data.role
              localStorage.userInfo = JSON.stringify(res.data.data)
              commit('SET_ROLE', res.data.data.role)
              resolve()
            })
            // resolve()
          } else {
            reject('')
          }
        }).catch(error => {
          if (error.response.status === 500) {
            Message({
              showClose: true,
              message: '账号或密码错误',
              type: 'error',
              duration: 4000
            })
          }
          reject(error)
        })
      })
    },

    // 前端 登出
    FedLogOut({commit}) {
      return new Promise(resolve => {
        localStorage.removeItem('token')
        localStorage.logInAgain = 'false'
        clearInterval(Number(localStorage.timer))
        commit('SET_TOKEN', '')
        resolve()
      })
    }
  }
}

export default user
