<template>
  <div class="container-fluid search-result-content">
    <div class="row">
      <!-- 左側餐廳列表 -->
      <div class="col-4 d-flex flex-column h-100 overflow-auto restaurant-list-container">
        <h4>搜尋結果</h4>
        <!-- 篩選條件 -->
        <div
          v-if="loading === false"
          class="filter-bar d-flex align-items-center justify-content-between mb-3 p-2 rounded shadow-sm bg-light"
        >
          <div class="d-flex align-items-center gap-2">
            <!-- 排序選單 -->
            <select
              v-model="sortOption"
              class="form-select form-select-sm"
              style="width: 160px"
              @change="applyFilters"
            >
              <option disabled value="">排序方式</option>
              <option value="rating_desc">評分高到低</option>
              <option value="rating_asc">評分低到高</option>
            </select>

            <!-- 營業中按鈕 -->
            <button
              class="btn btn-sm"
              :class="onlyOpenNow ? 'btn-primary' : 'btn-outline-primary'"
              @click="toggleOpenNow"
            >
              只顯示營業中
            </button>
          </div>
        </div>

        <p v-if="loading">載入中...</p>
        <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
        <ul class="no-bullets restaurant-list" v-if="restaurants.length">
          <li v-for="restaurant in restaurants" :key="restaurant.id">
            <RestaurantResultsCard :restaurant="restaurant" @focus-marker="focusMarker" />
          </li>
        </ul>
        <p v-if="!loading && restaurants.length === 0">找不到符合條件的餐廳</p>
        <Drawer
          ref="restaurantDrawer"
          :title="'餐廳詳情'"
          :drawerLeft="drawerLeft"
          :drawerHeight="drawerHeight"
          :drawerTop="drawerTop"
          :drawerId="'restaurant-detail-drawer'"
        >
          <RestaurantDetail v-if="selectedRestaurant" :restaurant="selectedRestaurant" />
        </Drawer>
      </div>

      <!-- 右側地圖，使用 sticky 固定在畫面上 -->
      <div class="col-8 position-sticky top-0 p-0" style="height: 100vh">
        <RestaurantMap ref="map_markers" :restaurants="restaurants" />
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
const selectedRestaurant = ref(null)
const loading = ref(false)
const errorMessage = ref('')

import RestaurantResultsCard from '@/components/RestaurantResultsCard.vue'
import RestaurantMap from '@/components/RestaurantMap.vue'
import RestaurantDetail from '@/components/RestaurantDetail.vue'
import Drawer from '@/components/Drawer.vue'

const API_URL = import.meta.env.VITE_API_BASE_URL
const map_markers = ref(null)
const restaurantDrawer = ref(null)
const drawerId = ref('restaurant-detail-drawer')

const drawerTop = ref(0)
const drawerLeft = ref(0)
const drawerHeight = ref(0)

const sortOption = ref('')

// 取得搜尋參數，發送 API 請求
const fetchRestaurants = async () => {
  loading.value = true
  errorMessage.value = ''

  if (!route.query.location && !route.query.category) {
    alert('請輸入搜尋條件')
    return
  }

  let coordinates = null

  //先取得座標
  const response = await axios.get(`${API_URL}/search/location/`, {
    params: {
      location: route.query.location,
    },
  })

  if (!response.data.longitude || !response.data.latitude) {
    if (route.query.location) {
      alert('找不到此地點的座標')
      return
    }
  }

  coordinates = {
    lat: response.data.latitude,
    lng: response.data.longitude,
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
  map_markers.value.setFocus(id)
  selectedRestaurant.value = restaurants.value.find((r) => r.id === id)

  restaurantDrawer.value.openDrawer()
}

const calculateNavTop = () => {
  let navbar = document.querySelector('.custom-navbar')

  if (navbar) {
    const navbarHeight = navbar.offsetHeight
    drawerTop.value = navbarHeight // 更新 drawerTop 的值
  } else {
    console.log('未找到 .custom-navbar')
  }
}

const calculateRestaurantListTop = () => {
  const restaurantlistContainer = document.querySelector('.restaurant-list-container')

  if (restaurantlistContainer) {
    restaurantlistContainer.style.top = `${drawerTop.value}px`
  }
}

const calculateDrawerLeft = () => {
  const restaurantlistContainer = document.querySelector('.restaurant-list-container')

  if (restaurantlistContainer) {
    const containerWidth = restaurantlistContainer.offsetWidth
    drawerLeft.value = containerWidth // 更新 drawerLeft 的值
  } else {
    console.log('未找到 .restaurant-list-container')
  }
}

const calculateDrawerHeight = () => {
  const screenHeight = window.innerHeight
  console.log(drawerId.value)
  const element = document.getElementById(drawerId.value) // 獲取具有 id "myElement" 的元素
  const computedStyle = window.getComputedStyle(element)

  if (!computedStyle) {
    console.log('未找到 .restaurant-detail-drawer')
    return
  }

  let marginBottom = parseInt(computedStyle.marginBottom, 10)

  drawerHeight.value = screenHeight - drawerTop.value - marginBottom
}

// 頁面載入時執行 API 請求
onMounted(() => {
  calculateNavTop()
  calculateRestaurantListTop()
  calculateDrawerHeight()
  calculateDrawerLeft()
  fetchRestaurants()
})

// 當網址的 Query 變更時，自動重新載入搜尋結果
watch(() => route.query, fetchRestaurants)
</script>

<style scoped>
.restaurant-list-container {
  position: relative;
  border-right: 1px solid #ddd; /* 右側邊框 */
  margin: 10px 0;
}

.restaurant-list {
  background-color: #f9f9f9; /* 淡灰色背景 */
  padding: 10px;
}

.no-bullets {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.error {
  color: red;
}

.filter-bar {
  border: 1px solid #ddd;
  background-color: #f8f9fa; /* Bootstrap 淺灰背景 */
}
</style>
