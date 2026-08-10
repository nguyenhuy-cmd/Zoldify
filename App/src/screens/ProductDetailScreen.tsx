import React, { useState, useEffect, useContext } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  SafeAreaView,
} from 'react-native';
import api, { BASE_URL } from '../services/api';
import { CartContext } from '../context/CartContext';
import { COLORS, TYPOGRAPHY, SPACING } from '../theme/theme';

export default function ProductDetailScreen({ route, navigation }: any) {
  const { id } = route.params;
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const cartContext = useContext(CartContext);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await api.get(`/products/${id}`);
        // API NestJS thường trả về { data: product } hoặc product
        setProduct(response.data.data || response.data);
      } catch (error) {
        console.log('Lỗi lấy chi tiết sản phẩm:', error);
        Alert.alert('Lỗi', 'Không thể tải thông tin sản phẩm');
        navigation.goBack();
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [id, navigation]);

  const handleAddToCart = async () => {
    if (!product) return;
    setAdding(true);
    try {
      await cartContext?.addToCart(product.id, 1);
      Alert.alert('Thành công', 'Đã thêm sản phẩm vào giỏ hàng!', [
        { text: 'Tiếp tục xem' },
        { text: 'Đến giỏ hàng', onPress: () => navigation.navigate('CartTab') },
      ]);
    } catch (error: any) {
      Alert.alert('Lỗi', error.message || 'Chưa đăng nhập hoặc không thể thêm sản phẩm');
    } finally {
      setAdding(false);
    }
  };

  const getImageUrl = (imagePath: string) => {
    if (!imagePath) return 'https://via.placeholder.com/300';
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    return `${BASE_URL}${imagePath.startsWith('/') ? '' : '/'}${imagePath}`;
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (!product) return null;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Image
          source={{ uri: getImageUrl(product.image || (product.images && product.images[0])) }}
          style={styles.image}
          resizeMode="cover"
        />

        <View style={styles.infoContainer}>
          <Text style={styles.price}>{product.price?.toLocaleString('vi-VN')} đ</Text>
          <Text style={styles.name}>{product.name}</Text>

          {product.is_freeship && (
            <View style={styles.freeshipBadge}>
              <Text style={styles.freeshipText}>Miễn phí vận chuyển</Text>
            </View>
          )}

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>Thông tin chi tiết</Text>
          <View style={styles.specRow}>
            <Text style={styles.specLabel}>Tình trạng:</Text>
            <Text style={styles.specValue}>{product.condition || 'Còn mới'}</Text>
          </View>
          <View style={styles.specRow}>
            <Text style={styles.specLabel}>Số lượng trong kho:</Text>
            <Text style={styles.specValue}>{product.stock ?? 1} chiếc</Text>
          </View>
          {product.brand && (
            <View style={styles.specRow}>
              <Text style={styles.specLabel}>Thương hiệu:</Text>
              <Text style={styles.specValue}>{product.brand}</Text>
            </View>
          )}

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>Mô tả sản phẩm</Text>
          <Text style={styles.description}>{product.description || 'Không có mô tả cho sản phẩm này.'}</Text>

          <View style={styles.divider} />

          {/* Seller Information */}
          <Text style={styles.sectionTitle}>Người bán</Text>
          <View style={styles.sellerCard}>
            <View style={styles.sellerAvatarPlaceholder}>
              <Text style={styles.sellerAvatarText}>
                {product.seller?.full_name?.charAt(0).toUpperCase() || 'U'}
              </Text>
            </View>
            <View style={styles.sellerInfo}>
              <Text style={styles.sellerName}>{product.seller?.full_name || 'Sinh viên ẩn danh'}</Text>
              <Text style={styles.sellerContact}>{product.seller?.email || ''}</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Purchase Action Bar */}
      <View style={styles.actionContainer}>
        <TouchableOpacity style={styles.addToCartButton} onPress={handleAddToCart} disabled={adding}>
          {adding ? (
            <ActivityIndicator color={COLORS.primary} />
          ) : (
            <Text style={styles.addToCartText}>Thêm Vào Giỏ</Text>
          )}
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.buyNowButton} 
          onPress={async () => {
            try {
              await cartContext?.addToCart(product.id, 1);
              navigation.navigate('CartTab');
            } catch (e) {
              Alert.alert('Thông báo', 'Vui lòng đăng nhập trước khi mua hàng');
            }
          }}
        >
          <Text style={styles.buyNowText}>Mua Ngay</Text>
        </TouchableOpacity>
      </View>
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
  scrollContent: {
    paddingBottom: 100, // Chừa khoảng trống cho Action Bar ở bottom
  },
  image: {
    width: '100%',
    height: 350,
    backgroundColor: '#F3F4F6',
  },
  infoContainer: {
    padding: SPACING.md,
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -20,
  },
  price: {
    fontSize: 26,
    fontWeight: '800',
    color: COLORS.secondary,
    marginBottom: SPACING.xs,
  },
  name: {
    ...TYPOGRAPHY.h1,
    color: COLORS.text,
    lineHeight: 30,
  },
  freeshipBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginTop: SPACING.sm,
  },
  freeshipText: {
    color: COLORS.secondary,
    fontSize: 12,
    fontWeight: '700',
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: SPACING.md,
  },
  sectionTitle: {
    ...TYPOGRAPHY.h2,
    fontSize: 16,
    color: COLORS.primary,
    marginBottom: SPACING.sm,
  },
  specRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  specLabel: {
    color: COLORS.textMuted,
    fontSize: 14,
  },
  specValue: {
    color: COLORS.text,
    fontWeight: '600',
    fontSize: 14,
  },
  description: {
    fontSize: 15,
    color: COLORS.text,
    lineHeight: 22,
  },
  sellerCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.background,
    padding: SPACING.md,
    borderRadius: 12,
    alignItems: 'center',
  },
  sellerAvatarPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sellerAvatarText: {
    color: COLORS.surface,
    fontSize: 18,
    fontWeight: '700',
  },
  sellerInfo: {
    marginLeft: SPACING.md,
  },
  sellerName: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
  },
  sellerContact: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
  actionContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.surface,
    flexDirection: 'row',
    padding: SPACING.md,
    borderTopWidth: 1,
    borderColor: COLORS.border,
    justifyContent: 'space-between',
  },
  addToCartButton: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    paddingVertical: SPACING.md,
    marginRight: SPACING.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addToCartText: {
    color: COLORS.primary,
    fontWeight: '700',
    fontSize: 15,
  },
  buyNowButton: {
    flex: 1.2,
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: SPACING.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buyNowText: {
    color: COLORS.surface,
    fontWeight: '700',
    fontSize: 15,
  },
});
