// composables/useGoogleLogin.js
import { ref, nextTick, computed } from 'vue'
import { useUserStore } from '@/stores/user'

const googleClientID = import.meta.env.VITE_GOOGLE_CLIENT_ID
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

function loadGoogleSdk(callback) {
  if (document.getElementById('google_sdk')) {
    callback && callback()
    return
  }

  const script = document.createElement('script')
  script.src = 'https://accounts.google.com/gsi/client'
  script.id = 'google_sdk'
  script.async = true
  script.defer = true
  script.onload = callback
  document.head.appendChild(script)
}

function renderGoogleButton(selector = '#google_login', options = {}) {
  nextTick(() => {
    const target = document.querySelector(selector)
    if (target) {
      target.innerHTML = ''
      window.google.accounts.id.renderButton(target, {
        theme: 'outline',
        size: 'large',
        ...options,
      })
    }
  })
}

export function useGoogleLogin() {
  const userStore = useUserStore()

  function handleCredentialResponse(response) {
    const id_token = response.credential

    userStore.setUserState(userStore.AuthStatus.LOGGING_IN)

    fetch(BACKEND_URL + 'api/google/callback', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id_token }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log('登入成功:', data)
        userStore.login(data)
      })
      .catch((error) => {
        console.error('登入失敗:', error)
      })
  }
  function initGoogleLogin() {
    window.google.accounts.id.initialize({
      client_id: googleClientID,
      callback: handleCredentialResponse,
    })
  }

  function logout() {
    userStore.logout()
    renderGoogleButton()
  }

  return {
    loadGoogleSdk,
    initGoogleLogin,
    renderGoogleButton,
    logout,
  }
}
