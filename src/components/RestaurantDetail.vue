<template>
  <div class="restaurant-detail">
    <!-- 餐廳圖片 -->
    <div class="carousel-container">
      <div id="carouselExampleIndicators" class="carousel slide" data-bs-ride="carousel">
        <div class="carousel-indicators">
          <button
            type="button"
            data-bs-target="#carouselExampleIndicators"
            data-bs-slide-to="0"
            class="active"
            aria-current="true"
            aria-label="Slide 1"
          ></button>
          <button
            type="button"
            data-bs-target="#carouselExampleIndicators"
            data-bs-slide-to="1"
            aria-label="Slide 2"
          ></button>
          <button
            type="button"
            data-bs-target="#carouselExampleIndicators"
            data-bs-slide-to="2"
            aria-label="Slide 3"
          ></button>
        </div>
        <div class="carousel-inner">
          <div class="carousel-item active">
            <img :src="restaurant.real_image_url" class="d-block w-100" alt="Restaurant Image" />
          </div>
          <div class="carousel-item">
            <img :src="restaurant.real_image_url" class="d-block w-100" alt="Restaurant Image" />
          </div>
          <div class="carousel-item">
            <img :src="restaurant.real_image_url" class="d-block w-100" alt="Restaurant Image" />
          </div>
        </div>
        <button
          class="carousel-control-prev"
          type="button"
          data-bs-target="#carouselExampleIndicators"
          data-bs-slide="prev"
        >
          <span class="carousel-control-prev-icon" aria-hidden="true"></span>
          <span class="visually-hidden">Previous</span>
        </button>
        <button
          class="carousel-control-next"
          type="button"
          data-bs-target="#carouselExampleIndicators"
          data-bs-slide="next"
        >
          <span class="carousel-control-next-icon" aria-hidden="true"></span>
          <span class="visually-hidden">Next</span>
        </button>
      </div>
    </div>

    <hr class="separator" />

    <!-- 餐廳詳情 -->
    <div class="restaurant-detail-info">
      <h3 class="restaurant-name">{{ restaurant.name }}</h3>
      <div class="restaurant-detail-card">
        <div class="card-body">
          <div class="detail-item">
            <h6>評分：</h6>
            <span class="card-text">⭐ {{ restaurant.rating?.toFixed(1) || '尚無評分' }}</span>
          </div>
          <div class="detail-item">
            <h6>地址：</h6>
            <span class="card-text">{{ restaurant.address }}</span>
          </div>
          <div class="detail-item">
            <h6>電話：</h6>
            <p class="mb-1"><i class="bi bi-telephone-fill me-2 text-secondary"></i>{{ restaurant.phone_number || '無提供' }}</p>
          </div>
          <div class="detail-item">
            <h6>營業時間：</h6>
            <div v-for="(time, day) in restaurant.opening_hours" :key="day">
              <span class="card-text">{{ day }}: {{ time }}</span>
            </div>
          </div>
          <div class="view-map">
            <a :href="restaurant.google_url" class="btn btn-primary" target="_blank" rel="noopener noreferrer"
              >在 Google 地圖查看</a
            >
          </div>
        </div>
      </div>
    </div>

    <!-- 評論 -->
    <div class="comments-section">
      <h3 class="restaurant-detail-title">評論</h3>
      <div v-if="comments.length === 0">
        <p>尚無評論，快來留下你的評論吧！</p>
      </div>
      <div v-else>
        <p>共 {{ comments.length }} 筆評論</p>
        <div v-for="comment in comments" :key="comment.id" class="comment-item">
          <div class="d-flex justify-content-between align-items-start mb-2">
            <div class="d-flex align-items-center">
              <!-- 使用者頭像 -->
              <img
                :src="comment.avatar_url || defaultAvatar"
                class="comment-avatar me-2"
                alt="user avatar"
              />
              <!-- 使用者名稱 -->
              <div>
                <h6 class="comment-user mb-1">{{ comment.username }}</h6>
                <!-- 星星評分 -->
                <div class="comment-stars">
                  <span
                    v-for="i in 5"
                    :key="i"
                    class="star"
                    :class="{ active: i <= comment.rating }"
                    >★</span
                  >
                </div>
              </div>
            </div>
            <!-- 評論時間 -->
            <div class="text-end">
              <small class="comment-timestamp">{{ formatCommentTime(comment) }}</small>
              <div v-if="comment.username === currentUser" class="comment-actions mt-1">
                <button class="btn btn-sm btn-outline-secondary me-1" @click="self_editing = true">
                  編輯
                </button>
                <button class="btn btn-sm btn-outline-danger" @click="deleteComment(comment.id)">
                  刪除
                </button>
              </div>
            </div>
          </div>
          <p v-if="!self_editing" class="comment-content">
            {{ comment.review }}
          </p>
          <form v-else class="row g-3">
            <div class="mb-3">
              <textarea class="form-control" id="exampleFormControlTextarea1" rows="3">{{ comment.review }}</textarea>
            </div>
            <div class="col-auto">
              <button type="submit" class="btn btn-primary mb-3">確定</button>
              <button type="button" class="btn btn-outline-secondary mb-3" @click="self_editing = false">
                取消
              </button>
            </div>
          </form>
        </div>

        <p class="see-more">...查看更多</p>
      </div>

      <div class="comment-form">
        <h5>新增評論</h5>
        <form v-if="user" @submit.prevent="createComment">
          <!-- 評分區塊 -->
          <div class="mb-3">
            <label class="form-label fw-bold">評分</label>
            <div class="star-rating">
              <input type="radio" id="food-5" value="5" v-model="self_rating" name="food" />
              <label for="food-5">★</label>
              <input type="radio" id="food-4" value="4" v-model="self_rating" name="food" />
              <label for="food-4">★</label>
              <input type="radio" id="food-3" value="3" v-model="self_rating" name="food" />
              <label for="food-3">★</label>
              <input type="radio" id="food-2" value="2" v-model="self_rating" name="food" />
              <label for="food-2">★</label>
              <input type="radio" id="food-1" value="1" v-model="self_rating" name="food" />
              <label for="food-1">★</label>
            </div>
          </div>
          <div class="mb-3">
            <label for="comment" class="form-label">內容</label>
            <textarea
              v-model="self_content"
              class="form-control"
              id="comment"
              name="comment"
              rows="3"
            ></textarea>
          </div>
          <button type="submit" class="btn btn-primary">送出</button>
        </form>
        <p v-if="!user">
          <a href="#" class="btn btn-primary" @click.prevent="ModalStore.openModal"
            >登入後發表評論
          </a>
        </p>
      </div>
    </div>

    <!-- 相似餐廳 -->
    <!-- <div class="similar-restaurants"> -->
      <!-- <h3 class="restaurant-detail-title">相似餐廳</h3> -->
      <!-- <div class="similar-restaurant-items"> -->
        <!-- 可以填入相似餐廳項目 -->
      <!-- </div> -->
    <!-- </div> -->
  </div>
</template>

<script setup>
import { ReviewAPI } from '@/api/commentAPI'
import { StatusCodes } from 'http-status-codes'
import { computed, reactive, ref, watch, nextTick } from 'vue'
import { useUserStore } from '@/stores/user'
import { useModalStore } from '@/stores/modal'

const props = defineProps({
  restaurant: {
    type: Object,
    required: true,
    default: () => ({}),
  },
})

const self_rating = ref(0)
const self_content = ref('')
const self_editing = ref(false)

const defaultAvatar = '/images/user.png' //User icons created by kmg design - Flaticon

const userStore = useUserStore()
const user = computed(() => userStore.user)
const currentUser = computed(() => userStore.user?.username)
const ModalStore = useModalStore()

// const comments = [
//   {
//     id: 1,
//     username: 'user1',
//     avatar_url: '', // 你可以放預設圖或使用者上傳圖
//     review: '這家餐廳很好吃',
//     rating: 4,
//     created_at: '2025-05-05T06:31:00Z',
//     updated_at: '2025-05-05T06:31:00Z'
//   },
//   {
//     id: 2,
//     username: 'user2',
//     avatar_url: '',
//     review: '環境舒適，服務也不錯',
//     rating: 5,
//     created_at: '2025-05-05T06:40:00Z',
//     updated_at: '2025-05-05T06:45:00Z'
//   },
// ]

const comments = ref([])

function formatCommentTime(comment) {
  const created = new Date(comment.created_at)
  const updated = new Date(comment.updated_at)

  const isEdited = updated.getTime() !== created.getTime()

  const displayDate = created.toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

  return isEdited ? `${displayDate}（已編輯）` : displayDate
}

async function getRestaurantReviews(restaurantId) {
  // 取得評論
  try {
    const response = await ReviewAPI.getAllReview(restaurantId)
    // const response = await axios.get(`${API_URL}/reviews/?restaurant_id=${restaurantId}`);
    if (response.status === StatusCodes.OK) {
      if (response.data.length > 0) {
        comments.value = response.data
        console.log('取得評論成功:', response.data)
      }
    } else {
      if (response.status === StatusCodes.NO_CONTENT) {
        console.log('沒有評論')
      }
    }
  } catch (error) {
    alert('取得評論失敗')
    console.log(error)
  }
}

// 新增評論
async function createComment() {
  const rating = self_rating.value
  const content = self_content.value

  if (!rating || !content) {
    alert('請填寫完整評論')
    return
  }

  const data = {
    rating: rating,
    review: content,
    restaurant_id: props.restaurant.id,
  }

  try {
    const response = await ReviewAPI.creatReview(data)
    // const response = await axios.post(`${API_URL}/reviews/`, data);

    if (response.status === StatusCodes.CREATED) {
      console.log('新增評論成功:', response.data)
      comments.value.push(response.data)

      self_rating.value = 0
      self_content.value = ''
    }
  } catch (error) {
    if (error.response) {
      const serverError = error.response.data?.error || '新增評論失敗'
      alert(serverError)
    } else {
      alert('連線錯誤，請稍後再試')
    }
    console.error(error)
  }
}

// function EditComment(review_id) {}

// 更新評論
async function updateComment(review_id, rating, content) {
  // const response = await axios.put(`${API_URL}/reviews/${params.id}/`, params);
  const data = {
    rating: rating,
    review: content,
  }

  try {
    const response = await ReviewAPI.updateReview(review_id, data)

    if (response.status === StatusCodes.OK) {
      console.log('更新評論成功:', response.data)
    }
  } catch (error) {
    console.log(error)
    alert('更新評論失敗')
  }
}

// 刪除評論
async function deleteComment(review_id) {
  // const response = await axios.delete(`${API_URL}/reviews/${params.id}/`);
  try {
    const response = await ReviewAPI.deleteReview(review_id)

    if (response.status === StatusCodes.OK) {
      console.log('刪除評論成功:', response.data)
    }
  } catch (error) {
    console.log(error)
    alert('刪除評論失敗')
  }
}

const restaurantId = computed(() => props.restaurant?.id)

watch(restaurantId, (newVal) => {
  console.log('餐廳 ID 更新為：', newVal)

  if (newVal) {
    //清空評論
    comments.value = [] // 重設
    nextTick(() => {
      getRestaurantReviews(newVal);
    })
  }
}, { immediate: true })
</script>

<style scoped>
.restaurant-detail {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 10px;
}

.carousel-container {
  width: 100%;
  max-width: 900px;
  margin-bottom: 20px;
  border-radius: 10px;
  overflow: hidden;
}

.separator {
  border-top: 1px solid #ddd;
  margin: 20px 0;
}

.restaurant-detail-info {
  width: 100%;
  max-width: 500px;
  margin-bottom: 20px;
}

.restaurant-name {
  font-size: 2rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 15px;
}

.restaurant-detail-card {
  background-color: #fff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.card-body {
  padding: 0;
}

.detail-item {
  margin-bottom: 15px;
}

.detail-item h6 {
  font-size: 1.1rem;
  color: #495057;
  font-weight: 600;
  margin-bottom: 5px;
}

.card-text {
  font-size: 1rem;
  color: #6c757d;
  line-height: 1.6;
}

.view-map {
  margin-top: 20px;
}

.btn-primary {
  background-color: #007bff;
  border-color: #007bff;
  padding: 10px 15px;
  font-size: 1rem;
  border-radius: 5px;
}

.restaurant-detail-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 15px;
}

.comments-section {
  width: 100%;
  max-width: 700px;
  margin: 40px auto;
  padding: 20px;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
}

.comment-item {
  margin-bottom: 20px;
  padding: 15px 20px;
  background-color: #f8f9fa;
  border-left: 4px solid #0d6efd;
  border-radius: 8px;
}

.comment-user {
  font-weight: 600;
  color: #343a40;
  margin-bottom: 5px;
}

.comment-content {
  font-size: 1rem;
  color: #495057;
  line-height: 1.5;
}

.comment-form {
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #dee2e6;
}

.comment-form h5 {
  margin-bottom: 15px;
  font-size: 1.25rem;
  font-weight: 600;
  color: #212529;
}

.comment-form .form-control {
  font-size: 1rem;
  border-radius: 6px;
}

.comment-form button {
  margin-top: 10px;
  padding: 8px 16px;
  font-size: 1rem;
  border-radius: 6px;
}

.comment-timestamp {
  font-size: 0.85rem;
  color: #868e96;
}

.see-more {
  margin-top: 10px;
  font-size: 0.9rem;
  color: #0d6efd;
  cursor: pointer;
}

.star-rating {
  direction: rtl;
  font-size: 1.5rem;
}
.star-rating input[type='radio'] {
  display: none;
}
.star-rating label {
  color: #ccc;
  cursor: pointer;
}
.star-rating input[type='radio']:checked ~ label {
  color: #ffc107;
}
.star-rating label:hover,
.star-rating label:hover ~ label {
  color: #ffc107;
}

.similar-restaurants {
  margin-top: 30px;
}

.similar-restaurant-items {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
}

.similar-restaurant-card {
  background-color: #fff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 250px;
  text-align: center;
}

.comment-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.comment-stars {
  margin-top: 2px;
}

.star {
  color: #ccc;
  font-size: 1rem;
}

.star.active {
  color: #ffc107;
}

.comment-actions button {
  font-size: 0.8rem;
  padding: 3px 8px;
}
</style>
