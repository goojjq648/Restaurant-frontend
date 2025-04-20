<template>
  <div
    class="offcanvas offcanvas-start"
    tabindex="-1"
    :class="{ show: isVisible }"
    :style="{
      visibility: isVisible ? 'visible' : 'hidden',
      left: drawerLeft + 'px',
      height: drawerHeight + 'px',
      top: drawerTop + 'px',
    }"
    :id="drawerId"
    aria-labelledby="drawerLabel"
  >
    <div class="offcanvas-header">
      <h5 id="drawerLabel">{{ title }}</h5>
      <button
        type="button"
        class="btn-close"
        data-bs-dismiss="offcanvas"
        aria-label="Close"
        @click="closeDrawer"
      ></button>
    </div>
    <div class="offcanvas-body">
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// 控制抽屜顯示與隱藏的狀態
const isVisible = ref(false)

const closeDrawer = () => {
  isVisible.value = false // 關閉抽屜
}

// 顯示抽屜的函數
const openDrawer = () => {
  isVisible.value = true // 顯示抽屜
}

defineExpose({
  openDrawer, // 暴露給父組件調用
  closeDrawer,
})

defineProps({
  drawerLeft: {
    type: Number,
    default: 0,
  },
  drawerHeight: {
    type: Number,
    default: 0,
  },
  drawerTop: {
    type: Number,
    default: 0,
  },
  title: {
    type: String,
    default: '',
  },
  drawerId: {
    type: String,
    default: '',
  },
})
</script>

<style scoped>
.hide {
  transform: translateX(100%);
}

.offcanvas {
  position: fixed;
  width: 300px;
  border-radius: 12px;
  background-color: white;
  transition: transform 0.3s ease;
  z-index: 9100;

  margin-top: 2px;
  margin-bottom: 10px;
}
</style>
