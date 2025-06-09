<template>
  <div class="cat-loading-container">
    <transition-group name="fade" tag="div" class="cat-faces">
      <img v-for="n in count" :key="n" :src="catImage" alt="貓咪臉" class="cat-face" />
    </transition-group>
    <p class="loading-text">{{ message }}</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import catImage from '@/assets/my-cat-face.png'

const count = ref(1)
const message = ref('幫你找餐廳中...')

onMounted(() => {
  let frame = 0
  const messages = ['喵？', '喵喵？', '快好了喵！🐾', '餐廳鎖定中🐾', '喵！抓到了！']

  const interval = setInterval(() => {
    count.value = count.value >= 3 ? 1 : count.value + 1
    message.value = messages[frame % messages.length]
    frame++
  }, 800)
})
</script>

<style scoped>
.cat-loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 0;
}

.cat-faces {
  display: flex;
  gap: 10px;
  justify-content: center;
  align-items: center;
  margin-bottom: 12px;
}

.cat-face {
  width: 60px;
  height: 60px;
  object-fit: contain;
  animation: bounce 0.6s ease;
}

@keyframes bounce {
  0% {
    transform: translateY(0);
    opacity: 0.6;
  }
  50% {
    transform: translateY(-10px);
    opacity: 1;
  }
  100% {
    transform: translateY(0);
    opacity: 0.8;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

.loading-text {
  font-size: 16px;
  color: #555;
  font-weight: 500;
  text-align: center;
  min-height: 1.5em;
}
</style>
