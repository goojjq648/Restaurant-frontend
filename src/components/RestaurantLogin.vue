<template>
  <div
    class="modal fade"
    id="RestaurantLogin"
    tabindex="-1"
    aria-labelledby="RestaurantLoginLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content rounded-4 shadow">
        <div class="modal-header bg-light border-0">
          <h5 class="modal-title fw-bold">{{ title }}</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
            @click="closeLoginModal"
          ></button>
        </div>

        <div class="modal-body text-center">
          <form v-if="quicklogin">
            <div class="mb-3">
              <label for="exampleInputEmail1" class="form-label">電子郵件</label>
              <input
                type="email"
                class="form-control"
                id="exampleInputEmail1"
                aria-describedby="emailHelp"
              />
            </div>
            <div class="mb-3">
              <label for="exampleInputPassword1" class="form-label">密碼</label>
              <input type="password" class="form-control" id="exampleInputPassword1" />
            </div>
            <div>
              <p class="text-muted">
                還沒有帳號嗎？
                <button type="button" class="register-link" >立即註冊</button>
              </p>
            </div>
            <button type="submit" class="btn btn-primary">登入</button>
          </form>
          <div v-else-if="!user && !quicklogin" class="login-options">
            <p class="mb-3 text-muted text-center">請選擇登入方式：</p>
            <div id="google_login" class="d-flex justify-content-center mb-2"></div>
            <div class="text-center">
              <p class="text-muted">或</p>
              <button class="btn btn-outline-secondary" @click="quicklogin = true">
                使用帳號登入
              </button>
            </div>
          </div>
          <div v-else-if="user">
            <p class="fs-5">👋 歡迎，{{ user.email }}</p>
            <button class="btn btn-outline-danger mt-3" @click="logout">登出</button>
          </div>
        </div>

        <div class="modal-footer border-0">
          <button
            v-if="quicklogin"
            type="button"
            class="btn btn-secondary"
            @click="leaveQuickLogin"
          >
            返回
          </button>
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">關閉</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Modal } from 'bootstrap'
import { nextTick } from 'vue'

defineProps({ title: String });
const emit = defineEmits(['closeLoginModal']);

const googleClientID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const user = ref(null);
const quicklogin = ref(false);

function handleCredentialResponse(response) {
  const id_token = response.credential;

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
      localStorage.setItem('user', JSON.stringify(data))
      user.value = data
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

  window.google.accounts.id.renderButton(document.getElementById('google_login'), {
    theme: 'outline',
    size: 'large',
  })
}

function renderGoogleButton() {
  // 等待 DOM 更新 等畫面更新完再 render 按鈕
  nextTick(() => {
    const loginDiv = document.getElementById('google_login')
    if (loginDiv) {
      loginDiv.innerHTML = ''
      window.google.accounts.id.renderButton(loginDiv, {
        theme: 'outline',
        size: 'large',
      })
    }
  })
}

function logout() {
  localStorage.removeItem('user')
  user.value = null

  renderGoogleButton()
}

const openLoginModal = () => {
  const modalElement = document.getElementById('RestaurantLogin')
  if (modalElement) {
    const modal = new Modal(modalElement)
    modal.show()
  }
}

const leaveQuickLogin = () => {
  quicklogin.value = false
  renderGoogleButton()
}

defineExpose({ openLoginModal })

onMounted(() => {
  const savedUser = localStorage.getItem('user')
  if (savedUser) {
    user.value = JSON.parse(savedUser)
  }

  const LoginModal = document.getElementById('RestaurantLogin')
  if (LoginModal) {
    LoginModal.addEventListener('hidden.bs.modal', () => {
      emit('closeLoginModal')
    })
  }

  // 避免重複加載
  if (!document.getElementById('google_sdk')) {
    const script = document.createElement('script')
    script.src = 'https://accounts.google.com/gsi/client'
    script.id = 'google_sdk'
    script.async = true
    script.defer = true
    script.onload = initGoogleLogin
    document.head.appendChild(script)
  } else {
    initGoogleLogin();
  }
})
</script>

<style scoped>
.modal-content {
  border-radius: 1rem;
}
.btn-outline-danger {
  width: 100%;
}

.modal-body form {
  text-align: left;
  padding: 0 1rem;
}

.modal-body input {
  border-radius: 0.5rem;
}

.modal-body button {
  margin-top: 0.5rem;
}

.btn-outline-danger {
  width: 100%;
}

/* 註冊連結樣式（讓它像超連結） */
.register-link {
  background: none;
  border: none;
  padding: 0;
  margin-left: 0.25rem;
  color: #0d6efd;
  text-decoration: underline;
  cursor: pointer;
}

.register-link:hover {
  color: #0a58ca;
  font-weight: 600;
}

/* 登入方式區塊（Google & 自訂帳號） */
.login-options {
  padding: 0 1rem;
}

.login-options p {
  margin-bottom: 0.5rem;
}
</style>
