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
            <span class="card-text">{{ restaurant.rating }}</span>
          </div>
          <div class="detail-item">
            <h6>地址：</h6>
            <span class="card-text">{{ restaurant.address }}</span>
          </div>
          <div class="detail-item">
            <h6>營業時間：</h6>
            <div v-for="(time, day) in restaurant.opening_hours" :key="day">
              <span class="card-text">{{ day }}: {{ time }}</span>
            </div>
          </div>
          <div class="view-map">
            <a href="#" class="btn btn-primary" target="_blank" rel="noopener noreferrer">在 Google 地圖查看</a>
          </div>
        </div>
      </div>
    </div>

    <!-- 評論 -->
    <div class="comments-section">
      <h3 class="restaurant-detail-title">評論</h3>
      <div v-for="comment in comments" :key="comment.id" class="comment-item">
        <h5 class="comment-user">{{ comment.user }}</h5>
        <p class="comment-content">{{ comment.content }}</p>
      </div>
    </div>

    <!-- 相似餐廳 -->
    <div class="similar-restaurants">
      <h3 class="restaurant-detail-title">相似餐廳</h3>
      <div class="similar-restaurant-items">
        <!-- 可以填入相似餐廳項目 -->
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  restaurant: {
    type: Object,
    required: true,
  },
})

const comments = [
  { id: 1, user: 'user1', content: '這家餐廳很好吃' },
  { id: 2, user: 'user2', content: '這家餐廳很好吃' },
  { id: 3, user: 'user3', content: '這家餐廳很好吃' },
]
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
  margin-top: 30px;
}

.comment-item {
  margin-bottom: 20px;
  padding: 15px;
  background-color: #f1f3f5;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.comment-user {
  font-weight: 500;
  color: #495057;
  margin-bottom: 8px;
}

.comment-content {
  font-size: 1rem;
  color: #495057;
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
</style>
