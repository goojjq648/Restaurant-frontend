<template>
  <ul v-if="suggestions.length" class="suggestions"
      :style="{
        top: `${positionTop}px`,
        left: `${positionLeft}px`,
        width: `${positionWidth}px`
      } "
    >
    <li
      v-for="(suggestion, index) in suggestions"
      :key="index"
      :ref="(el) => setItemRef(el, index)"
      :class="{ active: index === activeIndex }"
      @click="selectSuggestion(index)"
      v-html="highlightMatch(suggestion)"
    >
    </li>
  </ul>
</template>

<script setup>
import { defineProps, defineEmits, ref, nextTick } from 'vue';

const props = defineProps({
  suggestions: {
    type: Array,
    required: true
  },
  query: {
    type: String,
    required: true
  },
  inputRef: {
    type: Object, // 用來接收外部傳入的輸入框 ref
    required: true
  }
});

// 更新選擇到的建議
const emit = defineEmits(['select']);
// 當前選擇的建議
const activeIndex = ref(-1);

// 提示框的位置
const positionTop = ref(0);
const positionLeft = ref(0);
const positionWidth = ref(0);

// 清空舊的 ref，避免重複綁定
const suggestionItems = ref([]);

const setItemRef = (el, index) => {
  if (el) {
    suggestionItems.value[index] = el;
  }
};

// 更新建議框的位置
const updatePosition = () => {
  if (props.inputRef?.getBoundingClientRect) {
    const rect = props.inputRef.getBoundingClientRect();
    positionTop.value = rect.top + rect.height + window.scrollY;
    positionLeft.value = rect.left + window.scrollX;
    positionWidth.value = rect.width;
  }
};

// 高亮匹配文字
const highlightMatch = (suggestion) => {
  const text = `${suggestion.city || ''}${suggestion.district || ''}${suggestion.road || ''}`;
  if (!props.query) return text;

  const regex = new RegExp(`(${props.query})`, 'gi');
  return text.replace(regex, `<strong>$1</strong>`);
};

// 使用鍵盤移動選擇建議
const moveSelection = (step) => {
  if (props.suggestions.length > 0) {
    activeIndex.value =
      (activeIndex.value + step + props.suggestions.length) %
      props.suggestions.length;

    // 使用 nextTick 確保 DOM 已更新
    nextTick(() => {
      const target = suggestionItems.value[activeIndex.value]; // 正確取得選中項目

      if (target) {
        target.scrollIntoView({
          behavior: 'smooth', // 平滑滾動
          block: 'center' // 讓滾動項目置中
        });
      }
    });
  }
};

// 選取建議
const selectSuggestion = (index) => {
  if (index >= 0 && index < props.suggestions.length) {
    emit('select', props.suggestions[index]);
    activeIndex.value = -1;
  }
};

//關掉建議框
const closeSuggestionBox = () => {
  activeIndex.value = -1;
}

// 監聽鍵盤事件
defineExpose({
  moveSelection,
  selectSuggestion,
  updatePosition,
  closeSuggestionBox
});
</script>

<style scoped>
.suggestions {
  position: fixed;
  width: 100%;
  max-height: 200px;
  overflow-y: auto;
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 8px;
  z-index: 1000;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.suggestions li {
  list-style-type: none;
  padding: 12px;
  cursor: pointer;
}

.suggestions li:hover,
.suggestions li.active {
  background-color: #f0f0f0;
}

strong {
  color: #007bff;
}
</style>
