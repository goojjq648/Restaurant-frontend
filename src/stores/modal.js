import { defineStore } from 'pinia'
import { ref, nextTick } from 'vue'
import RestaurantLogin from '@/components/RestaurantLogin.vue'

export const useModalStore = defineStore('modal', () => {
  const isOpen = ref(false);

  const openModal = () => {
    isOpen.value = true;
  }

  const closeModal = () => {
    isOpen.value = false;
  }

  return { isOpen, openModal, closeModal }
})
