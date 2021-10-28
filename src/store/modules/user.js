import {login} from '@/api/login'
import {Message} from 'element-ui';

const user = {
  state: {
    token: '',
    name: '',
    avatar: ''
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
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
            localStorage.logInAgain = 'false'
            resolve()
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
