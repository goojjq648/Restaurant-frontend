<template>
  <div :class="isInNavbar ? 'search-navbar' : 'search-section'">
    <div class="input-group">
      <input
        ref="inputRef"
        v-model="searchLocation"
        type="text"
        class="form-control"
        placeholder="輸入想搜尋的地點"
        @input="getAddressSuggestions"
        @keyup.enter="suggestionBox?.selectSuggestion(activeIndex)"
        @keydown.down.prevent="suggestionBox?.moveSelection(1)"
        @keydown.up.prevent="suggestionBox?.moveSelection(-1)"
        @keydown.esc.prevent="suggestionBox?.closeSuggestionBox"
      />
      <!-- 建議框 -->
      <SuggestionBox
        ref="suggestionBox"
        :suggestions="suggestions"
        :query="searchLocation"
        :inputRef="inputRef"
        @select="handleSelect"
      />
    </div>

    <div class="input-group">
      <input
        v-model="searchCategory"
        type="text"
        class="form-control"
        placeholder="搜尋美食類型"
        @keyup.enter="search"
      />
    </div>

    <button class="btn btn-outline-secondary search-button" @click="search">🔍</button>
  </div>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import { debounce } from 'lodash'
import SuggestionBox from './SuggestionBox.vue'

const API_URL = import.meta.env.VITE_API_BASE_URL
const route = useRoute()
const router = useRouter()

const searchLocation = ref('')
const searchCategory = ref('')
const suggestions = reactive([])
const activeIndex = ref(-1)
const inputRef = ref(null);
const suggestionBox = ref(null);

const isInNavbar = computed(() => {
  return route.path.startsWith('/map') || route.path.startsWith('/restaurant/')
})

const updatePosition = () => {
  suggestionBox.value?.updatePosition(); //確保位置正確
};

// 取得建議結果 (用 debounce 防止過於頻繁)
const getAddressSuggestions = debounce(async () => {
  if (!searchLocation.value.trim()) {
    suggestions.splice(0)
    activeIndex.value = -1
    return
  }

  try {
    const response = await axios.get(`${API_URL}/search/address/`, {
      params: { query: searchLocation.value.trim() },
    })

    // 過濾掉無效的結果
    suggestions.splice(
      0,
      suggestions.length,
      ...response.data.filter((item) => item.city || item.district || item.road),
    )
    activeIndex.value = -1
    suggestionBox.value?.updatePosition(); //更新位置
  } catch (error) {
    console.error('地址補全請求失敗:', error)
  }
}, 300)


const handleSelect = (suggestion) => {
  searchLocation.value = `${suggestion.city || ''}${suggestion.district || ''}${suggestion.road || ''}`
  suggestions.splice(0)
}

// 觸發搜尋
const search = () => {
  if (!searchLocation.value.trim() && !searchCategory.value.trim()) {
    alert('請輸入搜尋條件')
    return
  }

  router.push({
    path: '/search',
    query: {
      location: searchLocation.value.trim(),
      category: searchCategory.value.trim(),
    },
  })
}
</script>

<style scoped>
.search-navbar {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.search-navbar .input-group {
  width: 130px;
}

.search-section {
  display: flex;
  justify-content: center;
  gap: 1rem;
}

.search-section .input-group {
  max-width: 500px;
}

strong {
  color: #007bff;
}

.search-button {
  border: 1px solid #ccc;
  border-radius: 5px;
  cursor: pointer;
}
</style>
