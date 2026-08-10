import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  RefreshControl,
} from 'react-native';
import api, { BASE_URL } from '../services/api';
import { COLORS, TYPOGRAPHY, SPACING } from '../theme/theme';

export default function HomeScreen({ navigation }: any) {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Gọi API lấy danh mục
  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories');
      const data = response.data.data?.result || response.data.data || response.data;
      setCategories(Array.isArray(data) ? data : []);
    } catch (error) {
      console.log('Lỗi tải danh mục:', error);
    }
  };

  // Gọi API lấy sản phẩm
  const fetchProducts = async (catId: number | null = null, query: string = '') => {
    try {
      setLoading(true);
      const params: any = {
        current: 1,
        pageSize: 50,
      };
      if (catId) params.category_id = catId;
      if (query) params.q = query;

      const response = await api.get('/products', { params });
      const data = response.data.data?.result || response.data.data || response.data;
      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.log('Lỗi tải sản phẩm:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([fetchCategories(), fetchProducts(selectedCategory, searchQuery)]);
    setRefreshing(false);
  }, [selectedCategory, searchQuery]);

  const handleCategoryPress = (catId: number | null) => {
    setSelectedCategory(catId);
    fetchProducts(catId, searchQuery);
  };

  const handleSearch = () => {
    fetchProducts(selectedCategory, searchQuery);
  };

  // Xử lý URL ảnh đầy đủ
  const getImageUrl = (imagePath: string) => {
    if (!imagePath) return 'https://via.placeholder.com/150';
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    // Đối với ảnh cục bộ trên backend
    return `${BASE_URL}${imagePath.startsWith('/') ? '' : '/'}${imagePath}`;
  };

  const renderProductItem = ({ item }: { item: any }) => {
    return (
      <TouchableOpacity
        style={styles.productCard}
        onPress={() => navigation.navigate('ProductDetail', { id: item.id })}
      >
        <Image
          source={{ uri: getImageUrl(item.image || (item.images && item.images[0])) }}
          style={styles.productImage}
          resizeMode="cover"
        />
        <View style={styles.productInfo}>
          <Text style={styles.productName} numberOfLines={2}>
            {item.name}
          </Text>
          <Text style={styles.productPrice}>
            {item.price?.toLocaleString('vi-VN')} đ
          </Text>
          {item.is_freeship && (
            <View style={styles.badgeContainer}>
              <Text style={styles.badgeText}>Freeship</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Search Header */}
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm kiếm giáo trình, đồ gia dụng cũ..."
            placeholderTextColor={COLORS.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
          />
          <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
            <Text style={styles.searchButtonText}>Tìm</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Categories Bar */}
        <View style={styles.categorySection}>
          <Text style={styles.sectionTitle}>Danh Mục Sản Phẩm</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
            <TouchableOpacity
              style={[
                styles.categoryButton,
                selectedCategory === null && styles.categoryButtonActive,
              ]}
              onPress={() => handleCategoryPress(null)}
            >
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === null && styles.categoryTextActive,
                ]}
              >
                Tất cả
              </Text>
            </TouchableOpacity>
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                style={[
                  styles.categoryButton,
                  selectedCategory === cat.id && styles.categoryButtonActive,
                ]}
                onPress={() => handleCategoryPress(cat.id)}
              >
                <Text
                  style={[
                    styles.categoryText,
                    selectedCategory === cat.id && styles.categoryTextActive,
                  ]}
                >
                  {cat.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Products Grid */}
        <View style={styles.productSection}>
          <Text style={styles.sectionTitle}>Sản Phẩm Đang Bán</Text>
          {loading && products.length === 0 ? (
            <ActivityIndicator size="large" color={COLORS.primary} style={styles.loader} />
          ) : products.length === 0 ? (
            <Text style={styles.noProductsText}>Không tìm thấy sản phẩm nào phù hợp.</Text>
          ) : (
            <FlatList
              data={products}
              renderItem={renderProductItem}
              keyExtractor={(item) => item.id.toString()}
              numColumns={2}
              scrollEnabled={false}
              columnWrapperStyle={styles.productRow}
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    backgroundColor: COLORS.surface,
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingLeft: SPACING.md,
  },
  searchInput: {
    flex: 1,
    height: 48,
    color: COLORS.text,
    fontSize: 15,
  },
  searchButton: {
    backgroundColor: COLORS.primary,
    height: 48,
    paddingHorizontal: SPACING.lg,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopRightRadius: 11,
    borderBottomRightRadius: 11,
  },
  searchButtonText: {
    color: COLORS.surface,
    fontWeight: '700',
  },
  scrollContent: {
    paddingBottom: SPACING.xl,
  },
  categorySection: {
    padding: SPACING.md,
  },
  sectionTitle: {
    ...TYPOGRAPHY.h2,
    marginBottom: SPACING.md,
    color: COLORS.primary,
  },
  categoryScroll: {
    flexDirection: 'row',
  },
  categoryButton: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    marginRight: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  categoryButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  categoryText: {
    fontSize: 14,
    color: COLORS.text,
    fontWeight: '500',
  },
  categoryTextActive: {
    color: COLORS.surface,
    fontWeight: '700',
  },
  productSection: {
    paddingHorizontal: SPACING.md,
  },
  productRow: {
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  productCard: {
    backgroundColor: COLORS.surface,
    width: '48%',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 2,
  },
  productImage: {
    width: '100%',
    height: 150,
    backgroundColor: '#F3F4F6',
  },
  productInfo: {
    padding: SPACING.sm,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    height: 40,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.secondary,
    marginTop: SPACING.xs,
  },
  badgeContainer: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    alignSelf: 'flex-start',
    paddingHorizontal: SPACING.xs,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: SPACING.xs,
  },
  badgeText: {
    color: COLORS.secondary,
    fontSize: 10,
    fontWeight: '700',
  },
  loader: {
    marginVertical: SPACING.xl,
  },
  noProductsText: {
    color: COLORS.textMuted,
    textAlign: 'center',
    marginTop: SPACING.xl,
  },
});
