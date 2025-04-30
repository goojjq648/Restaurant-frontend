import axios from 'axios'

const API_URL = import.meta.env.VITE_API_BASE_URL

const instance = axios.create({
  timeout: 10000,
});

//請求前夾帶token
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if(config.data instanceof FormData){
      config.headers['Content-Type'] = 'multipart/form-data';
    }else if(!config.headers['Content-Type'])
    config.headers['Content-Type'] = 'application/json';


    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

//response 處理前
instance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // 刷新token
      try {
        const response = await axios.post(API_URL + '/refresh/', {
          refresh: localStorage.getItem('refresh_token'),
        });

        const newAccessToken = response.data.access
        localStorage.setItem('access_token', newAccessToken);
        // 更新原始請求的標頭
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return instance(originalRequest); // 重新發送原始請求
      } catch (refreshError) {
        console.error('refresh token 失敗', refreshError)
        // 如果 refresh_token 過期 ➔ 強制登出
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        localStorage.removeItem('user')
        window.location.href = '/login' // 跳回登入頁
      }
    }
    return Promise.reject(error);
  }
);

export default instance;
