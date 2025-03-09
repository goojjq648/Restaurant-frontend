<template>
  <div id="map" ref="mapContainer"></div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import L from "leaflet";

const mapContainer = ref(null);

onMounted(() => {
  const map = L.map(mapContainer.value).setView([25.0330, 121.5654], 14); // 預設在台北市

  // 加入 OpenStreetMap 圖層
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  // 在地圖上加一個 Marker（可選）
  L.marker([25.0330, 121.5654])
    .addTo(map)
    .bindPopup("台北市中心")
    .openPopup();
});
</script>

<style scoped>
#map {
  width: 100%;
  height: 100%; /* 調整地圖高度 */

  object-fit: cover; /* 讓地圖完整顯示 */
  margin: 0;
}
</style>
