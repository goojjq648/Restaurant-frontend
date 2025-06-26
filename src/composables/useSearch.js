import { useRouter } from 'vue-router'

export function useSearch() {
  const router = useRouter()

  const searchByCondition = ({ location, category }) => {
    if (!location.trim() && !category.trim()) {
      alert('請輸入搜尋條件')
      return
    }

    router.push({
      path: '/search',
      query: {
        location: location.trim(),
        category: category.trim(),
      },
    })
  }

  return {
    searchByCondition,
  }
}
