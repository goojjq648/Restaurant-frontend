<template>
  <div :class="isInNavbar ? 'search-navbar' : 'search-section'">
    <div class="input-group">
      <input
        v-model="searchLocation"
        type="text"
        class="form-control"
        placeholder="搜尋地點"
        @keyup.enter="search"
      />
    </div>

    <div class="input-group">
      <input
        v-model="searchCategory"
        type="text"
        class="form-control"
        placeholder="搜尋美食類型"
        @keyup.enter="search"
        required
      />
    </div>

    <button class="btn btn-outline-secondary search-button" @click="search">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16">
        <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/>
      </svg>
    </button>
  </div>
</template>

<script setup>
import { computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ref } from "vue";


const route = useRoute();
const router = useRouter();

// 檢查是否在 `Navbar` 裡
const isInNavbar = computed(() => {
  return route.path.startsWith('/map') || route.path.startsWith('/restaurant/');
});

// 綁定搜尋輸入
const searchLocation = ref("");
const searchCategory = ref("");

const search = () => {
  if(!searchLocation.value && !searchCategory.value){
    alert("請輸入搜尋條件");
  }

  router.push({
    path: "/search",
    query: {
      location: searchLocation.value,
      category: searchCategory.value
    }
  });
}

// 監聽 searchLocation 變化，取得座標
// watch(searchLocation, async (newLocation) => {
//   if (newLocation) {
//     const coordinates = await getCoordinatesFromAddressOSM(newLocation);
//     console.log("獲取的座標:", coordinates);
//   }
// });

</script>

<style scoped>
/* 讓 SearchFood 在 Navbar 內部變小 */
.search-navbar {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.search-navbar .input-group {
  width: 130px; /*  限制 Navbar 內的搜尋欄大小 */
}

/* 讓 SearchFood 在大區塊（如探索美食標題區）時變大 */
.search-section {
  display: flex;
  justify-content: center;
  gap: 1rem;
}

.search-section .input-group {
  max-width: 500px; /* 適應大畫面 */
}

.search-button {
  border: 1px solid #cccbcb;
  border-radius: 5px;
  cursor: pointer;
}
</style>
