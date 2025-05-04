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
          ></button>
        </div>
        <div class="modal-body text-center">
          <!-- 註冊 -->
          <form v-if="currentLoginMode === LOGIN_MODE.REGISTER" @submit.prevent="register">
            <div class="mb-3">
              <label for="exampleInputEmail1" class="form-label">電子郵件</label>
              <input
                v-model="email"
                type="email"
                class="form-control"
                id="exampleInputEmail1"
                aria-describedby="emailHelp"
                required
              />
            </div>
            <div class="mb-3">
              <label for="exampleInputPassword1" class="form-label">密碼</label>
              <input
                v-model="password"
                type="password"
                class="form-control"
                id="exampleInputPassword1"
                required
              />
            </div>
            <div class="mb-3">
              <label for="exampleInputPassword2" class="form-label">確認密碼</label>
              <input
                v-model="confirmPassword"
                type="password"
                class="form-control"
                id="exampleInputPassword2"
                required
              />
            </div>
            <button type="submit" class="btn btn-primary" :disabled="isSubmitting">註冊</button>
          </form>
          <form
            v-else-if="currentLoginMode === LOGIN_MODE.QUICK_LOGIN"
            @submit.prevent="quicklogin"
          >
            <div class="mb-3">
              <label for="exampleInputEmail1" class="form-label">電子郵件</label>
              <input
                v-model="email"
                type="email"
                class="form-control"
                id="exampleInputEmail1"
                aria-describedby="emailHelp"
              />
            </div>
            <div class="mb-3">
              <label for="exampleInputPassword1" class="form-label">密碼</label>
              <input
                v-model="password"
                type="password"
                class="form-control"
                id="exampleInputPassword1"
              />
            </div>
            <div>
              <p class="text-muted">
                還沒有帳號嗎？
                <button
                  type="button"
                  class="register-link"
                  @click="switchLoginMode(LOGIN_MODE.REGISTER)"
                >
                  立即註冊
                </button>
              </p>
            </div>
            <button type="submit" class="btn btn-primary">登入</button>
          </form>
          <div v-else-if="!user && currentLoginMode === LOGIN_MODE.LOGIN" class="login-options">
            <p class="mb-3 text-muted text-center">請選擇登入方式：</p>
            <div id="google_login" class="d-flex justify-content-center mb-2"></div>
            <div class="text-center">
              <p class="text-muted">或</p>
              <button
                class="btn btn-outline-secondary"
                @click="switchLoginMode(LOGIN_MODE.QUICK_LOGIN)"
              >
                使用帳號登入
              </button>
            </div>
          </div>
          <div v-else-if="user">
            <p class="fs-5">👋 歡迎，{{ user.email }}</p>
            <button type="button" class="register-link" @click="goToUserProfile">
              修改個人資料
            </button>
            <button class="btn btn-outline-danger mt-3" @click="logout">登出</button>
          </div>
        </div>

        <div class="modal-footer border-0">
          <button
            v-if="
              currentLoginMode === LOGIN_MODE.QUICK_LOGIN ||
              currentLoginMode === LOGIN_MODE.REGISTER
            "
            type="button"
            class="btn btn-secondary"
            @click="switchLoginMode(LOGIN_MODE.LOGIN)"
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
import { ref, onMounted, computed, watch, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { Modal } from 'bootstrap'
import { useGoogleLogin } from '@/composables/useGoogleLogin'
import { useUserStore } from '@/stores/user'
// import axios from 'axios'
import axios from '@/composables/axios'
import { StatusCodes } from 'http-status-codes'

//登入介面的模式
const LOGIN_MODE = {
  LOGIN: 0,
  QUICK_LOGIN: 1,
  REGISTER: 2,
}

// props 定義
defineProps({ title: String })
const emit = defineEmits(['closeLoginModal'])

//pina - user
const userStore = useUserStore()
const user = computed(() => userStore.user)

// ref data
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const isSubmitting = ref(false)
const currentLoginMode = ref(LOGIN_MODE.LOGIN)

//axios 定義
const API_URL = import.meta.env.VITE_API_BASE_URL

//router
const router = useRouter()

// google login
const { loadGoogleSdk, initGoogleLogin, renderGoogleButton, logout } = useGoogleLogin()

function switchLoginMode(mode) {
  if (!Object.values(LOGIN_MODE).includes(mode)) {
    console.warn('無效的登入模式:', mode)
    return
  }

  currentLoginMode.value = mode
}

//註冊
async function register() {
  if (!email.value || !password.value || !confirmPassword.value) {
    alert('請填寫所有欄位')
    return
  }

  if (password.value !== confirmPassword.value) {
    alert('密碼不一致')
    return
  }

  isSubmitting.value = true

  try {
    const response = await axios.post(`${API_URL}/auth/register/`, {
      user: {
        email: email.value,
        password: password.value,
      },
    })

    if (response.status === StatusCodes.CREATED) {
      userStore.login(response.data.user, response.data.tokens);

      // 重置表單
      email.value = '';
      password.value = '';
      confirmPassword.value = '';

      switchLoginMode(LOGIN_MODE.LOGIN);
    } else {
      console.log('註冊失敗:', response.data.error);
    }
  } catch (error) {
    console.log(error);
  } finally {
    isSubmitting.value = false;
  }
}

//登入
async function quicklogin() {
  if (!email.value || !password.value) {
    alert('請填寫所有欄位')
    return
  }

  isSubmitting.value = true

  try {
    const response = await axios.post(`${API_URL}/auth/login/`, {
      email: email.value,
      password: password.value,
    })

    if (response.status === StatusCodes.OK) {
      console.log('login : ', response.data)
      userStore.login(response.data.user, response.data.tokens)

      email.value = ''
      password.value = ''

      switchLoginMode(LOGIN_MODE.LOGIN)
    } else {
      console.log('登入失敗:', response.data.error)
    }
  } catch (error) {
    console.log(error)
  } finally {
    isSubmitting.value = false
  }
}

function goToUserProfile() {
  if (user.value) {
    const modalEl = document.getElementById('RestaurantLogin')
    const modal = Modal.getInstance(modalEl)
    modal?.hide()

    // 等 Modal 動畫結束後再跳轉
    setTimeout(() => {
      router.push({ name: 'UserProfile' })
    }, 300)
  }
}

watch(currentLoginMode, (newMode) => {
  if (newMode === LOGIN_MODE.LOGIN && user.value === null) {
    nextTick(() => {
      renderGoogleButton()
    })
  }
})

const openLoginModal = () => {
  const modalElement = document.getElementById('RestaurantLogin')
  if (modalElement) {
    const modal = new Modal(modalElement)
    modal.show()
  }
}

defineExpose({ openLoginModal })

onMounted(() => {
  const LoginModal = document.getElementById('RestaurantLogin')
  if (LoginModal) {
    LoginModal.addEventListener('hidden.bs.modal', () => {
      emit('closeLoginModal')
    })
  }

  loadGoogleSdk(() => {
    initGoogleLogin()
    renderGoogleButton()
  })
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
