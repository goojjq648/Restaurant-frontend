<template>
  <nav class="navbar navbar-expand-lg fixed-top custom-navbar">
    <div class="container-fluid">
      <a class="navbar-brand" href="#">探索美食</a>

      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav d-flex w-100 justify-content-between">
          <li class="nav-item">
            <router-link to="/" class="nav-link">首頁</router-link>
          </li>
          <li class="nav-item ms-lg-auto">
            <!-- <router-link to="/login" class="nav-link">會員登入</router-link> -->
            <a href="#" @click.prevent="ModalStore.openModal" class="nav-link login-link"> {{ userlogin }} </a>
          </li>
          <li class="nav-item">
            <SearchFood v-if="showSearchFoodBar" class="search-navbar" />
          </li>
        </ul>
      </div>
    </div>
  </nav>
  <template v-if="ModalStore.isOpen">
    <RestaurantLogin
      ref="RestaurantLoginModal"
      :title="userlogin"
      @closeLoginModal="ModalStore.closeModal"
    />
  </template>
</template>

<script setup>
import { computed, nextTick, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ref } from 'vue'
import { useUserStore, AuthStatus } from '@/stores/user'
import { useModalStore } from '@/stores/modal'
import SearchFood from '@/components/SearchFood.vue'
import RestaurantLogin from './RestaurantLogin.vue'

const route = useRoute()

// const isclicklogin = ref(false)
const RestaurantLoginModal = ref(null)

const userlogin = computed(() =>
  userStore.state === AuthStatus.AUTHENTICATED ? '登出' : '會員登入',
)

const userStore = useUserStore()
const ModalStore = useModalStore()

// function showLoginModal() {
//   if (ModalStore.isOpen) return
//   ModalStore.openModal()

//   nextTick(() => {
//     RestaurantLoginModal.value.openLoginModal()
//   })
// }

watch(
  () => ModalStore.isOpen,
  (newVal, oldVal) => {
    nextTick(() => {
      if (newVal === true) {
        RestaurantLoginModal.value?.openLoginModal()
      }
    })
  },
)

//後面要改成只有餐廳搜尋結果頁面跟餐廳細節頁面要顯示
const showSearchFoodBar = computed(() => {
  // return route.path === '/'
  return route.path.startsWith('/search') || route.path.startsWith('/restaurant/')
})

// const ToggleLoginModal = () => {
//   isclicklogin.value = !isclicklogin.value;
// }

// watch(RestaurantLoginModal, (newCount, oldCount) => {
//   if (newCount !== null && isclicklogin.value === true) {
//     RestaurantLoginModal.value.openLoginModal();
//   }
// })
</script>

<style scoped>
.custom-navbar {
  background-color: #fff8e1;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
  padding: 10px 20px;
  font-weight: 500;
}

.navbar-brand {
  font-size: 20px;
  font-weight: 700;
  color: #fc4a1a;
}

.navbar-nav .nav-link {
  color: #333;
  transition: all 0.2s ease-in-out;
}

.navbar-nav .nav-link:hover {
  color: #fc4a1a;
}

.navbar-nav .router-link-active {
  font-weight: 700;
  border-bottom: 2px solid #fc4a1a;
}

.search-navbar {
  display: flex;
  align-items: center;
  margin-left: 1rem;
  max-width: 300px;
}

.login-link {
  border: 1px solid #fc4a1a;
  border-radius: 20px;
  padding: 4px 12px;
  color: #fc4a1a;
  font-weight: 600;
  transition: all 0.2s;
}

.login-link:hover {
  background-color: #fc4a1a;
  color: white;
}
</style>
