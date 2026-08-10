import React, { useContext } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  SafeAreaView,
} from 'react-native';
import { CartContext, CartItem } from '../context/CartContext';
import { BASE_URL } from '../services/api';
import { COLORS, TYPOGRAPHY, SPACING } from '../theme/theme';

export default function CartScreen({ navigation }: any) {
  const cartContext = useContext(CartContext);
  const { cartItems, isLoading, updateQuantity, removeFromCart } = cartContext || {
    cartItems: [],
    isLoading: false,
    updateQuantity: async () => {},
    removeFromCart: async () => {},
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      Alert.alert('Thông báo', 'Giỏ hàng của em đang trống');
      return;
    }

    Alert.alert(
      'Đặt hàng',
      'Em có muốn tiến hành đặt các sản phẩm này không?',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xác nhận',
          onPress: () => {
            Alert.alert('Thành công', 'Đơn hàng của em đã được tạo thành công trên hệ thống!');
            cartContext?.clearCartLocally();
          },
        },
      ]
    );
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      const price = item.product?.price || 0;
      return total + price * item.quantity;
    }, 0);
  };

  const getImageUrl = (imagePath: string) => {
    if (!imagePath) return 'https://via.placeholder.com/100';
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    return `${BASE_URL}${imagePath.startsWith('/') ? '' : '/'}${imagePath}`;
  };

  const renderCartItem = ({ item }: { item: CartItem }) => {
    const product = item.product || {};
    return (
      <View style={styles.cartCard}>
        <Image
          source={{ uri: getImageUrl(product.images ? (Array.isArray(product.images) ? product.images[0] : JSON.parse(product.images as any)[0]) : (product as any).image) }}
          style={styles.productImage}
          resizeMode="cover"
        />
        <View style={styles.infoContainer}>
          <Text style={styles.productName} numberOfLines={2}>
            {product.name || 'Sản phẩm không tên'}
          </Text>
          <Text style={styles.productPrice}>
            {product.price?.toLocaleString('vi-VN')} đ
          </Text>

          <View style={styles.actionsContainer}>
            <View style={styles.quantityContainer}>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => item.quantity > 1 && updateQuantity(item.id, item.quantity - 1)}
              >
                <Text style={styles.quantityButtonText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.quantityValue}>{item.quantity}</Text>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => updateQuantity(item.id, item.quantity + 1)}
              >
                <Text style={styles.quantityButtonText}>+</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.deleteButton} onPress={() => removeFromCart(item.id)}>
              <Text style={styles.deleteText}>Xóa</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  if (isLoading && cartItems.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {cartItems.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Giỏ hàng của em đang trống</Text>
          <TouchableOpacity style={styles.shopButton} onPress={() => navigation.navigate('HomeTab')}>
            <Text style={styles.shopButtonText}>Khám phá sản phẩm ngay</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <FlatList
            data={cartItems}
            renderItem={renderCartItem}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.listContent}
          />

          <View style={styles.footer}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Tổng cộng:</Text>
              <Text style={styles.totalPrice}>{calculateTotal().toLocaleString('vi-VN')} đ</Text>
            </View>

            <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
              <Text style={styles.checkoutText}>Tiến Hành Đặt Hàng</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.textMuted,
    marginBottom: SPACING.md,
  },
  shopButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: 12,
  },
  shopButtonText: {
    color: COLORS.surface,
    fontWeight: '700',
  },
  listContent: {
    padding: SPACING.md,
    paddingBottom: 120,
  },
  cartCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: SPACING.sm,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  productImage: {
    width: 90,
    height: 90,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
  },
  infoContainer: {
    flex: 1,
    marginLeft: SPACING.md,
    justifyContent: 'space-between',
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
  productPrice: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.secondary,
    marginVertical: 4,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    backgroundColor: COLORS.background,
  },
  quantityButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
  },
  quantityValue: {
    paddingHorizontal: SPACING.md,
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
  deleteButton: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
  },
  deleteText: {
    color: COLORS.error,
    fontSize: 13,
    fontWeight: '600',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.surface,
    padding: SPACING.md,
    borderTopWidth: 1,
    borderColor: COLORS.border,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  totalLabel: {
    fontSize: 16,
    color: COLORS.textMuted,
    fontWeight: '600',
  },
  totalPrice: {
    fontSize: 20,
    color: COLORS.secondary,
    fontWeight: '800',
  },
  checkoutButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: SPACING.md,
    alignItems: 'center',
  },
  checkoutText: {
    color: COLORS.surface,
    fontWeight: '700',
    fontSize: 16,
  },
});
