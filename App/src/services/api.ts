import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Thay đổi IP này phù hợp với môi trường chạy local của em.
// 10.0.2.2 là localhost từ phía Android Emulator.
// Nếu test máy thật, hãy đổi thành IP Wifi của máy tính chạy Backend (ví dụ: 192.168.1.x).
export const BASE_URL = 'http://10.0.2.2:3000/api/v1';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor thêm Token vào request headers nếu có
api.interceptors.request.use(
  async (config: any) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (e) {
      console.log('Lỗi đọc token:', e);
    }
    return config;
  },
  (error: any) => {
    return Promise.reject(error);
  }
);

export default api;
