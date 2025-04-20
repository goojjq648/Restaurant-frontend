<template>
<div v-if="restaurant" class="card mb-3 restaurant-item" @click="gotoMark(restaurant.id)">
  <div class="row g-0">

    <div class="col-md-3">
      <img :src="restaurant.real_image_url" class="img-fluid rounded-start" alt="餐廳主要圖片">
    </div>

    <div class="col-md-8">
      <div class="card-body">
        <h3 class="card-title">{{ restaurant.name }}</h3>
        <p class="card-text">
          <small class="text-body-secondary"  v-if="restaurant && restaurant.categories && restaurant.categories.length">
            {{restaurant.categories[0].name}}&nbsp;|&nbsp;
          </small>
          <span class="card-text">
            <small class="text-body-secondary">
              {{restaurant.average_spending}}
            </small>
          </span>
        </p>
        <p class="card-text">{{ restaurant.address }}</p>
        <p class="card-text">評分: {{ restaurant.rating }}</p>
      </div>
    </div>

  </div>
</div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

const emit = defineEmits(['focus-marker']);

defineProps({
  restaurant: Object
})

const gotoMark = (id) => {
  emit('focus-marker', id);
};

</script>

<style scoped>
.restaurant-item {
  display: flex;
  gap: 12px;
  padding: 14px;
  margin-bottom: 12px;
  border-radius: 12px;
  background-color: #fff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s ease;
  cursor: pointer;

  width: 100%;
}

.restaurant-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.restaurant-item img {
  width: 120px;
  height: 120px;
  object-fit: cover;
  border-radius: 8px;
}

.restaurant-item h3 {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 4px;
}

.restaurant-item p {
  font-size: 14px;
  color: #666;
}
</style>
