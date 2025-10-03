# 餐廳探索平台前端專案（Vue.js）

這是餐廳探索網站的前端專案，採用 Vue 3 框架實作為單頁應用程式（SPA），搭配 Bootstrap 5 打造響應式介面，並透過 Axios 串接 Django RESTful API。

使用者可以搜尋地區、查看餐廳地圖、點擊進入詳細資料頁，並支援登入機制與分類篩選。
✨ **已支援 Docker 開發環境**，不需本機安裝 Node.js，即可快速啟動。

- [Vue 3](https://vuejs.org/)（Composition API）
- [Vite](https://vitejs.dev/) 開發建構工具
- [Vue Router](https://router.vuejs.org/) 管理前端路由
- [Pinia](https://pinia.vuejs.org/) 狀態管理
- [Bootstrap 5](https://getbootstrap.com/) UI 樣式
- [Axios](https://axios-http.com/) 串接 API
- [Leaflet.js](https://leafletjs.com/) 地圖顯示
- [Google OAuth](https://developers.google.com/identity) 登入

# 後端專案
本專案搭配後端 Django 專案，提供 API 資料來源與搜尋邏輯。

👉 後端 GitHub Repo：[restaurant-backend](https://github.com/goojjq648/Django-Backend-Management/tree/main)

# 功能特色
地址與分類搜尋功能（整合後端模糊搜尋 API）

Leaflet 地圖顯示搜尋結果與餐廳位置

餐廳卡片與詳細頁面（圖片、營業時間、分類）

登入模組（支援登入模式切換，Google 登入）

響應式介面規劃中，目前以桌面版為主

# 專案結構簡介
```bash
src/
├── api/             # 所有與後端 API 溝通的封裝模組（Axios 請求）
├── assets/          # 靜態資源（圖片、樣式等）
├── components/      # 可重用的 UI 元件（如 Navbar、搜尋欄、卡片等）
├── composables/     # 可重用的 API 函數（ex: 登入狀態、Google 登入）
├── router/          # Vue Router 設定（路由對應頁面）
├── stores/          # Pinia 狀態管理（使用者登入狀態、搜尋結果等）
├── views/           # 各主要頁面（首頁、地圖頁、餐廳詳細頁、登入介面）
├── App.vue          # 應用程式根元件
└── main.js          # Vue 專案進入點，初始化 router、pinia 等
```

# 快速開始
### 安裝依賴
```bash
npm install
```

### API 設定與環境變數
請在專案根目錄建立 `.env` 檔案，設定與後端溝通的 API 路徑與 Google 登入所需的參數：
```
VITE_BACKEND_URL = http://127.0.0.1:8000/
VITE_API_BASE_URL = http://127.0.0.1:8000/api
VITE_GOOGLE_CLIENT_ID = 
```
#### 說明：
VITE_BACKEND_URL：後端主機根網址（用於非 API 用途，例如登入跳轉）

VITE_API_BASE_URL：實際呼叫後端 RESTful API 的 base URL

VITE_GOOGLE_CLIENT_ID：Google OAuth 登入所需的 client ID

### 開發方式
使用 Docker
1. 安裝 [Docker Desktop](https://www.docker.com/get-started/)  
（Windows/macOS 皆可, Linux 可安裝 Docker Engine）

2. 建置並啟動開發環境
```bash
docker compose build
docker compose up
```

初次啟動會自動安裝依賴，之後再次啟動只需：
```bash
docker compose up
```

瀏覽器打開 http://localhost:5173
進入開發模式 🚀
