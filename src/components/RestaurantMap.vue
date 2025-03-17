<template>
  <div id="map" ref="mapContainer"></div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import axios from "axios";
import L, { marker } from "leaflet";


const props = defineProps({
  restaurants: {
    type: Array,
    required: true,
  }
});

const mapContainer = ref(null);
let map = null;

const markers = ref([]);

// 監聽 props 變化
watch(
  () => props.restaurants,
  (newRestaurants) => {
    if (newRestaurants && newRestaurants.length) {
      if (!map) {
        initMap(newRestaurants);
      } else {
        // 清空地圖上的標記，避免重複
        map.eachLayer((layer) => {
          if (layer instanceof L.Marker) {
            map.removeLayer(layer);
          }
        });
        addMarkers(newRestaurants);
      }
    }
  }
);

const initMap = (restaurants) => {
  if (!restaurants || !restaurants.length) {
    return;
  }

  // 初始化地圖
  map = L.map(mapContainer.value).setView([restaurants[0].latitude, restaurants[0].longitude], 14);

  // 加入 OpenStreetMap 圖層
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors',
  }).addTo(map);

  addMarkers(restaurants);
};

const addMarkers = (restaurants) => {
  for (let restaurant of restaurants) {
    const marker = L.marker([restaurant.latitude, restaurant.longitude])
      .addTo(map)
      .bindPopup(`${restaurant.name}`);

    // 紀錄標記
    markers.value.push({
      id: restaurant.id,
      marker
    });
  }
};

// 處理點擊餐廳卡片後會有地圖座標資訊打開
const setFocus = (id) => {
  const target = markers.value.find(m => m.id === id);

  if (target) {
    map.setView(target.marker.getLatLng(), 15);
    target.marker.openPopup();
  }
};

defineExpose({
  setFocus
})
</script>

<style scoped>
#map {
  width: 100%;
  height: 100%; /* 調整地圖高度 */

  object-fit: cover; /* 讓地圖完整顯示 */
  margin: 0;
}
</style>
