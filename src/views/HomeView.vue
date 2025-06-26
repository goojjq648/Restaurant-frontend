<template>
  <main class="page-container">
    <section class="home-hero text-center">
      <h1 class="search-title">探索美食</h1>
      <p class="search-subtitle">無論在哪裡都能尋找想吃的美食</p>

      <!-- 搜尋欄元件 -->
      <SearchFood />

      <!-- 熱門搜尋按鈕 -->
      <div class="popular-tags mt-3">
        <button
          v-for="tag in popularTags"
          :key="tag"
          class="btn popular-tag"
          @click="searchTag(tag)"
        >
          {{ tag }}
        </button>
      </div>
    </section>

    <!-- 餐廳推薦區塊 -->
    <section class="restaurant-section container">
      <h5 class="section-title"><span class="icon">📌</span> 隨機探索</h5>
      <div class="row gx-3 gy-4">
        <div
          v-for="restaurant in recommendedRestaurants"
          :key="restaurant.id"
          class="col-12 col-md-6 col-lg-4"
        >
          <RestaurantCard :restaurant="restaurant" />
        </div>
      </div>

      <h5 class="section-title mt-5"><span class="icon">🔥</span> 熱門推薦餐廳</h5>
      <div class="row gx-3 gy-4">
        <div
          v-for="restaurant in recommendedRestaurants"
          :key="restaurant.id"
          class="col-12 col-md-6 col-lg-4"
        >
          <RestaurantCard :restaurant="restaurant" />
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import SearchFood from '@/components/SearchFood.vue'
import RestaurantCard from '@/components/RestaurantCard.vue'
import { SpecialRestaurantAPI } from '@/api/commentAPI'
import { useSearch } from '@/composables/useSearch'

const router = useRouter()
const popularTags = ['🍜 拉麵', '🥩 燒肉', '🍲 火鍋', '🍣 日式料理', '🇰🇷 韓國料理', '🌱 素食']

const { searchByCondition } = useSearch()

const searchTag = (tag) => {
  // 移除所有開頭的 emoji、標點、空白等，只留下分類名稱
  const cleanTag = tag.replace(/^[^\p{L}\p{N}]+/u, '').trim()

  if (!cleanTag) {
    alert('無效的標籤內容')
    return
  }

  searchByCondition({ location: '', category: cleanTag })
}

const recommendedRestaurants = ref([])

async function getRecommendRandomRestaurant() {
  const res = await SpecialRestaurantAPI.getRecommendRandomRestaurants(0, 0, 6)
  recommendedRestaurants.value = res.data
}

onMounted(() => {
  getRecommendRandomRestaurant()
})
</script>

<style scoped>
.page-container {
  background-color: #fdf7ed;
  padding-bottom: 60px;
}

.home-hero {
  background: linear-gradient(135deg, #f7b733, #fc4a1a);
  padding: 100px 20px 40px;
  color: white;
  border-radius: 0 0 30px 30px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.search-title {
  font-size: 48px;
  font-weight: 800;
  margin-bottom: 10px;
}

.search-subtitle {
  font-size: 18px;
  font-weight: 500;
  opacity: 0.9;
  margin-bottom: 20px;
}

.popular-tags {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
}

.popular-tag {
  border-radius: 30px;
  padding: 6px 18px;
  background: transparent;
  border: 2px solid white;
  color: white;
  font-weight: 500;
  transition: all 0.2s ease-in-out;
}

.popular-tag:hover {
  background-color: white;
  color: #fc4a1a;
  border-color: white;
}

.restaurant-section {
  padding: 40px 20px;
}

.section-title {
  font-size: 22px;
  font-weight: 600;
  margin-bottom: 20px;
  border-left: 5px solid #f7b733;
  padding-left: 10px;
  display: flex;
  align-items: center;
  gap: 8px;
}
</style>
