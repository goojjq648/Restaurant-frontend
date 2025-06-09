<template>
  <div class="horizontal-card d-flex shadow-sm mb-3">
    <img :src="restaurant.real_image_url" class="card-img" alt="圖片" />
    <div class="card-body d-flex flex-column justify-content-between">
      <div>
        <h5 class="card-title">{{ restaurant.name }}</h5>
        <p class="card-subtitle mb-1 text-muted small">{{ categoryText }}</p>
        <p class="card-address small text-muted">{{ restaurant.address }}</p>
      </div>
      <p class="card-rating mt-2 mb-0">評分: ⭐ {{ restaurant.rating }}</p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  restaurant: Object
})
</script>

<style scoped>
.horizontal-card {
  border-radius: 12px;
  overflow: hidden;
  background-color: #fff;
  height: 120px;
  max-width: 600px;
}

.card-img {
  width: 120px;
  height: 100%;
  object-fit: cover;
}

.card-body {
  padding: 10px 14px;
  flex: 1;
}

.card-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.card-subtitle {
  font-size: 13px;
}

.card-address {
  font-size: 12px;
}

.card-rating {
  font-size: 13px;
  color: #333;
}
</style>
