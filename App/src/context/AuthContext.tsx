import React, { createContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';

export interface UserProfile {
  id: number;
  full_name: string;
  email: string;
  phone_number?: string;
  avatar?: string;
  role: string;
}

interface AuthContextType {
  user: UserProfile | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (fullName: string, email: string, password: string, phoneNumber?: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Khôi phục token và thông tin user khi khởi động ứng dụng
  useEffect(() => {
    const bootstrapAsync = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('userToken');
        if (storedToken) {
          setToken(storedToken);
          // Lấy thông tin profile mới nhất từ server
          const response = await api.get('/auth/profile', {
            headers: { Authorization: `Bearer ${storedToken}` },
          });
          // Backend NestJS trả về user hoặc { data: user } tùy cấu trúc, giả sử trả về req.user trực tiếp
          // Xem ResponseMessage decorator hoặc format chuẩn backend.
          const userData = response.data.data || response.data;
          setUser(userData);
        }
      } catch (e: any) {
        console.log('Lỗi khôi phục session:', e);
        // Nếu lỗi token hết hạn, xóa đi
        await AsyncStorage.removeItem('userToken');
      } finally {
        setIsLoading(false);
      }
    };

    bootstrapAsync();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await api.post('/auth/login', { email, password });
      // Thường response.data = { access_token: '...', user: '...' } hoặc tương đương.
      // Hãy lấy token từ response
      const data = response.data.data || response.data;
      const accessToken = data.access_token;
      const userProfile = data.user;

      if (accessToken) {
        await AsyncStorage.setItem('userToken', accessToken);
        setToken(accessToken);
        setUser(userProfile || null);
        
        // Nếu response chưa có profile chi tiết, gọi API profile
        if (!userProfile) {
          const profileRes = await api.get('/auth/profile', {
            headers: { Authorization: `Bearer ${accessToken}` },
          });
          setUser(profileRes.data.data || profileRes.data);
        }
      }
    } catch (error: any) {
      console.log('Lỗi đăng nhập:', error);
      throw new Error(error.response?.data?.message || 'Đăng nhập không thành công');
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (fullName: string, email: string, password: string, phoneNumber?: string) => {
    try {
      setIsLoading(true);
      await api.post('/auth/register', {
        full_name: fullName,
        email,
        password,
        phone_number: phoneNumber,
      });
      // Đăng ký xong có thể tự động login luôn hoặc yêu cầu người dùng login
      await login(email, password);
    } catch (error: any) {
      console.log('Lỗi đăng ký:', error);
      throw new Error(error.response?.data?.message || 'Đăng ký không thành công');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      // Gọi API logout nếu cần thiết (không bắt buộc nhưng lịch sự)
      try {
        await api.post('/auth/logout');
      } catch (e: any) {
        // bỏ qua nếu lỗi mạng khi logout
      }
      await AsyncStorage.removeItem('userToken');
      setToken(null);
      setUser(null);
    } catch (error: any) {
      console.log('Lỗi đăng xuất:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
