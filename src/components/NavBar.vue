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
            <a href="#" @click.prevent="ToggleLoginModal" class="nav-link"> {{ userlogin }} </a>
          </li>
          <li class="nav-item">
            <SearchFood v-if="showSearchFoodBar" class="search-navbar" />
          </li>
        </ul>
      </div>
    </div>
  </nav>
  <template v-if="isclicklogin">
    <RestaurantLogin
      ref="RestaurantLoginModal"
      :title="userlogin"
      @closeLoginModal="ToggleLoginModal"
    />
  </template>
</template>

<script setup>
import { computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ref } from 'vue'
import { useUserStore, AuthStatus } from '@/stores/user'
import SearchFood from '@/components/SearchFood.vue'
import RestaurantLogin from './RestaurantLogin.vue'

const route = useRoute();

const isclicklogin = ref(false);
const RestaurantLoginModal = ref(null);

const userlogin = computed(() =>
  userStore.state === AuthStatus.AUTHENTICATED ? '登出' : '會員登入'
);
const userStore = useUserStore();

//後面要改成只有餐廳搜尋結果頁面跟餐廳細節頁面要顯示
const showSearchFoodBar = computed(() => {
  // return route.path === '/'
  return route.path.startsWith('/search') || route.path.startsWith('/restaurant/');
})

const ToggleLoginModal = () => {
  isclicklogin.value = !isclicklogin.value;
}

watch(RestaurantLoginModal, (newCount, oldCount) => {
  if (newCount !== null && isclicklogin.value === true) {
    RestaurantLoginModal.value.openLoginModal();
  }
})
</script>

<style scoped>
.custom-navbar {
  background-color: #faf4d8;
}

.search-navbar {
  display: flex;
  align-items: center;
  margin-left: auto;
  padding-right: 1rem;
  max-width: 300px; /* 限制寬度 */
}
</style>
