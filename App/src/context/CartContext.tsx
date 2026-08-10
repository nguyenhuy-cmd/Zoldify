import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from './AuthContext';

export interface CartItem {
  id: number;
  quantity: number;
  product: {
    id: number;
    name: string;
    price: number;
    images?: string | string[]; // Tùy thuộc dạng lưu (JSON string hay Array)
    stock: number;
  };
}

interface CartContextType {
  cartItems: CartItem[];
  isLoading: boolean;
  fetchCart: () => Promise<void>;
  addToCart: (productId: number, quantity?: number) => Promise<void>;
  updateQuantity: (cartId: number, quantity: number) => Promise<void>;
  removeFromCart: (cartId: number) => Promise<void>;
  clearCartLocally: () => void;
}

export const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const authContext = useContext(AuthContext);
  const isAuthenticated = !!authContext?.token;

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    } else {
      setCartItems([]);
    }
  }, [isAuthenticated]);

  const fetchCart = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/cart');
      // Thường API NestJS trả về dạng { data: [...] } hoặc [...] trực tiếp.
      // Dựa trên ResponseMessage decorator, response.data.data chứa kết quả thực tế.
      const items = response.data.data || response.data;
      setCartItems(Array.isArray(items) ? items : []);
    } catch (error) {
      console.log('Lỗi fetch giỏ hàng:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addToCart = async (productId: number, quantity: number = 1) => {
    try {
      setIsLoading(true);
      await api.post('/cart', { product_id: productId, quantity });
      await fetchCart(); // Refresh giỏ hàng
    } catch (error: any) {
      console.log('Lỗi thêm sản phẩm vào giỏ:', error);
      throw new Error(error.response?.data?.message || 'Không thể thêm sản phẩm');
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuantity = async (cartId: number, quantity: number) => {
    try {
      await api.patch(`/cart/${cartId}`, { quantity });
      // Cập nhật state cục bộ nhanh chóng trước khi gọi API
      setCartItems((prevItems) =>
        prevItems.map((item) => (item.id === cartId ? { ...item, quantity } : item))
      );
    } catch (error) {
      console.log('Lỗi cập nhật số lượng:', error);
      fetchCart(); // Fetch lại nếu lỗi để đồng bộ
    }
  };

  const removeFromCart = async (cartId: number) => {
    try {
      await api.delete(`/cart/${cartId}`);
      setCartItems((prevItems) => prevItems.filter((item) => item.id !== cartId));
    } catch (error) {
      console.log('Lỗi xóa sản phẩm khỏi giỏ:', error);
      fetchCart();
    }
  };

  const clearCartLocally = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        isLoading,
        fetchCart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCartLocally,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
