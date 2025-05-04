<template>
  <div class="container mt-5 profile-container">
    <ul class="nav nav-tabs custom-tabs">
      <li class="nav-item" @click="activeTab = 'profile'">
        <a class="nav-link" :class="{ active: activeTab === 'profile' }" href="#">個人資料</a>
      </li>
      <li class="nav-item" @click="activeTab = 'favorites'">
        <a class="nav-link" :class="{ active: activeTab === 'favorites' }" href="#">我的收藏</a>
      </li>
      <li class="nav-item" @click="activeTab = 'others'">
        <a class="nav-link" :class="{ active: activeTab === 'others' }" href="#">其他</a>
      </li>
    </ul>

    <div class="tab-content mt-4">
      <!-- 個人資料 Tab -->
      <div v-if="activeTab === 'profile'" class="tab-card">
        <h5 class="mb-3">帳戶資訊</h5>

        <div v-if="!isEditing">
          <div class="info-row"><strong>使用者名稱：</strong> <span>{{ user.username }}</span></div>
          <div class="info-row"><strong>Email：</strong> <span>{{ user.email }}</span></div>
          <div class="info-row"><strong>Google帳號：</strong>
            <span>{{ user.googleLinked ? '已連結' : '尚未連結' }}</span>
          </div>

          <div class="mt-3">
            <button class="btn btn-primary me-2" @click="isEditing = true">修改資料</button>
            <button class="btn btn-outline-secondary" @click="linkGoogle">
              {{ user.googleLinked ? '重新連結 Google' : '連結 Google 帳號' }}
            </button>
          </div>
        </div>

        <div v-else>
          <!-- 編輯表單 -->
          <div class="mb-3">
            <label class="form-label">使用者名稱</label>
            <input v-model="editForm.username" type="text" class="form-control" />
          </div>
          <div class="mb-3">
            <label class="form-label">Email</label>
            <input v-model="editForm.email" type="email" class="form-control" />
          </div>

          <div class="mt-3">
            <button class="btn btn-success me-2" @click="saveEdit">儲存變更</button>
            <button class="btn btn-outline-secondary" @click="cancelEdit">取消</button>
          </div>
        </div>
      </div>

      <!-- 其他 Tabs -->
      <div v-else-if="activeTab === 'favorites'" class="tab-card">
        <h5 class="mb-3">我的收藏</h5>
        <p>（這裡可以放你喜歡的餐廳清單）</p>
      </div>

      <div v-else class="tab-card">
        <h5 class="mb-3">其他設定</h5>
        <p>其他功能待補...</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore();
console.log(userStore.user);

const user = ref({
  username: userStore.user.username,
  email: userStore.user.email,
  googleLinked: userStore.user.googleLinked,
})

const editForm = ref({ username: '', email: '' })
const isEditing = ref(false)
const activeTab = ref('profile')

function linkGoogle() {
  alert('這裡串接 Google 登入邏輯')
}

function saveEdit() {
  if (!editForm.value.username || !editForm.value.email) {
    alert('請填寫完整資料')
    return
  }
  user.value.username = editForm.value.username
  user.value.email = editForm.value.email
  isEditing.value = false
}

function cancelEdit() {
  isEditing.value = false
}
</script>

<style scoped>
.profile-container {
  max-width: 700px;
  padding: 20px 0;
}
.custom-tabs .nav-link {
  cursor: pointer;
}
.tab-card {
  background-color: #fff;
  border: 1px solid #ddd;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}
.info-row {
  margin-bottom: 12px;
  display: flex;
  gap: 8px;
  font-size: 16px;
}
</style>
