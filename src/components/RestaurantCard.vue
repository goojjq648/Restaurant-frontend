<template>
  <div class="restaurant-card">
    <div class="card">
      <div class="card-body">
        <h5 class="card-title">{{ restaurant.name }}</h5>
        <p class="card-text">評分: ⭐ {{ restaurant.rating }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  restaurant: Object
})
</script>

<style scoped>
.restaurant-card {
  margin-bottom: 20px;
}
</style>
