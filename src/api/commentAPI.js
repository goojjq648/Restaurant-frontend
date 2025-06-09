import axios from '@/composables/axios'

const API_URL = import.meta.env.VITE_API_BASE_URL

const ReviewAPI = {
  getAllReview: (restaurantId) => axios.get(`${API_URL}/reviews/?restaurant_id=${restaurantId}`),
  creatReview: (data) => axios.post(`${API_URL}/reviews/`, data),
  updateReview: (review_id, data) => axios.patch(`${API_URL}/reviews/${review_id}/`, data),
  deleteReview: (review_id) => axios.delete(`${API_URL}/reviews/${review_id}/`),
}

const SpecialRestaurantAPI = {
  // 隨機推薦
  getRecommendRandomRestaurants: (lat, lng, limit) =>
    axios.get(`${API_URL}/recommend_restaurants/`, {
      params: { type: 'random', lat: lat, lng: lng, limit: limit },
    }),
}

export { ReviewAPI, SpecialRestaurantAPI }
