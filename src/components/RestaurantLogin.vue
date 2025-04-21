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
import { ref, onMounted, computed } from 'vue'
import { Modal } from 'bootstrap'
import { useGoogleLogin } from '@/composables/useGoogleLogin'
import { useUserStore } from '@/stores/user';

// props 定義
defineProps({ title: String });
const emit = defineEmits(['closeLoginModal']);

//pina
const userStore = useUserStore();
const user = computed(()=> userStore.user);

const quicklogin = ref(false);

// google login
const {
  loadGoogleSdk,
  initGoogleLogin,
  renderGoogleButton,
  logout
} = useGoogleLogin()


const openLoginModal = () => {
  const modalElement = document.getElementById('RestaurantLogin')
  if (modalElement) {
    const modal = new Modal(modalElement)
    modal.show();
  }
}

const leaveQuickLogin = () => {
  quicklogin.value = false
  renderGoogleButton();
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
    initGoogleLogin();
    renderGoogleButton();
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
