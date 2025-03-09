<template>
  <main class="page-container">
    <section>
      <div class="home-content">
        <h1 class="text-center search-title">探索美食</h1>
        <span class="search-content">無論在哪裡都能尋找想吃的美食</span>
        <SearchFood />

        <!-- 熱門搜尋推薦 -->
        <div class="text-center">
          <h5>熱門搜尋</h5>
          <div class="d-flex justify-content-center gap-2">
            <button
              v-for="tag in popularTags"
              :key="tag"
              class="btn btn-outline-secondary"
              @click="searchTag(tag)"
            >
              {{ tag }}
            </button>
          </div>
        </div>
      </div>

      <div>
        <h5 class="section-title">附近的餐廳</h5>
        <div class="row">
          <div v-for="restaurant in recommendedRestaurants" :key="restaurant.id" class="col-md-3">
            <RestaurantCard :restaurant="restaurant" />
          </div>
        </div>
      </div>

      <div>
        <h5 class="section-title">熱門推薦餐廳</h5>
        <div class="row">
          <div v-for="restaurant in recommendedRestaurants" :key="restaurant.id" class="col-md-3">
            <RestaurantCard :restaurant="restaurant" />
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import SearchFood from '@/components/SearchFood.vue'
import RestaurantCard from '@/components/RestaurantCard.vue'

const searchQuery = ref('')
const router = useRouter()

// 熱門搜尋關鍵字
const popularTags = ['拉麵', '燒肉', '火鍋', '日式料理', '韓國料理', '素食']

// 執行搜尋
const search = () => {
  if (!searchQuery.value.trim()) return
  router.push({ path: '/search', query: { q: searchQuery.value } })
}

// 熱門搜尋按鈕
const searchTag = (tag) => {
  router.push({ path: '/search', query: { q: tag } })
}

// 假資料，未來用 API 取得
const recommendedRestaurants = ref([
  { id: 1, name: '好美味餐廳A', rating: 4.5 },
  { id: 2, name: '好美味餐廳B', rating: 4.0 },
  { id: 3, name: '好美味餐廳C', rating: 3.8 },
  { id: 4, name: '好美味餐廳D', rating: 4.2 }
])
</script>

<style scoped>
.search-title {
  font-weight: bold;
  color: #ffffff;
}

.search-content {
  font-weight: bold;
  color: #ffffff;
}

.page-container {
  width: 100vw;
  min-height: 100vh;
}

.home-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;

  padding: 100px 0 20px 0;
  background-color: #e7961d;
}
</style>
