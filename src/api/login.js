import request from '@/utils/request'

export function login(username, password) {
  return request({
    url: 'user/login',
    method: 'post',
    data: {
      username,
      password
    }
  })
}

export function getInfo(token) {
  return request({
    url: '/user/info',
    method: 'get',
    // params: { token },
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}

export function logout() {
  return request({
    url: '/logout',
    method: 'post',
    headers: {
      'session-key': localStorage.token
    }
  })
}
