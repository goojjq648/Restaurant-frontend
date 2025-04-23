import { defineStore } from 'pinia'

export const AuthStatus = {
  UNAUTHENTICATED: 0,
  LOGGING_IN: 1,
  AUTHENTICATED: 2,
}

export const useUserStore = defineStore('user', {
  state: () => {
    const savedUser = JSON.parse(localStorage.getItem('user')) || null
    return {
      user: savedUser,
      state: savedUser ? AuthStatus.AUTHENTICATED : AuthStatus.UNAUTHENTICATED,
    }
  },

  actions: {
    setUserState(state) {
      this.state = state
    },
    login(user) {
      this.user = user
      localStorage.setItem('user', JSON.stringify(user))

      //登入後狀態
      this.setUserState(AuthStatus.AUTHENTICATED)
    },
    logout() {
      this.user = null
      localStorage.removeItem('user')

      // 登出後狀態
      this.setUserState(AuthStatus.UNAUTHENTICATED)
    },
  },
})
