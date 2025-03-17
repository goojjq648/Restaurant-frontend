<template>
  <div class="container-fluid search-result-content">
    <div class="row g-0">
      <!-- 左側餐廳列表 -->
      <div class="col-4 d-flex flex-column h-100 overflow-auto">
        <h2>搜尋結果</h2>
        <p v-if="loading">載入中...</p>
        <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
        <ul class="no-bullets restaurant-list" v-if="restaurants.length">
          <li v-for="restaurant in restaurants" :key="restaurant.id">
            <RestaurantResultsCard :restaurant="restaurant" @focus-marker="focusMarker"/>
          </li>
        </ul>
        <p v-if="!loading && restaurants.length === 0">找不到符合條件的餐廳</p>
      </div>

      <!-- 右側地圖，使用 sticky 固定在畫面上 -->
      <div class="col-8 position-sticky top-0 p-0" style="height: 100vh">
        <RestaurantMap ref="map_markers" :restaurants="restaurants"/>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'

const route = useRoute()
const restaurants = ref([])
const loading = ref(false)
const errorMessage = ref('')

const API_URL = import.meta.env.VITE_API_BASE_URL
import RestaurantResultsCard from '@/components/RestaurantResultsCard.vue'
import RestaurantMap from '@/components/RestaurantMap.vue'

const map_markers = ref(null);

// 取得使用者輸入的地址
async function getCoordinatesFromAddressOSM(address) {
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`

  try {
    const response = await fetch(url)
    const data = await response.json()

    if (data.length > 0) {
      return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) }
    } else {
      console.error('找不到地址')
      return null
    }
  } catch (error) {
    console.error('API 錯誤', error)
    return null
  }
}

// 取得搜尋參數，發送 API 請求
const fetchRestaurants = async () => {
  loading.value = true
  errorMessage.value = ''

  if (!route.query.location || !route.query.category) {
    alert('請輸入搜尋條件')
    return
  }

  let coordinates = null

  //先取得座標
  if (route.query.location) {
    coordinates = await getCoordinatesFromAddressOSM(route.query.location)
    if (!coordinates) {
      alert('找不到此地點的座標')
      return
    }
  }

  try {
    const response = await axios.get(`${API_URL}/restaurants/`, {
      params: {
        location: route.query.location,
        category: route.query.category,
        lat: coordinates?.lat, // 可能為 null
        lng: coordinates?.lng, // 可能為 null
      },
    })

    restaurants.value = response.data
  } catch (error) {
    errorMessage.value = '獲取餐廳失敗'
    console.error('錯誤：', error)
  } finally {
    loading.value = false
  }
}

const focusMarker = (id) => {
  console.log('focusMarker', id);
  console.log(map_markers.value);
  map_markers.value.setFocus(id);
}

// 頁面載入時執行 API 請求
onMounted(fetchRestaurants)

// 當網址的 Query 變更時，自動重新載入搜尋結果
watch(() => route.query, fetchRestaurants)
</script>

<style scoped>
.restaurant-list {
  background-color: #f9f9f9; /* 淡灰色背景 */
  padding: 10px;
  border-right: 1px solid #ddd; /* 右側邊框 */
}

.no-bullets {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.error {
  color: red;
}

</style>
