import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  SafeAreaView,
} from 'react-native';
import api from '../services/api';
import { COLORS, TYPOGRAPHY, SPACING } from '../theme/theme';

export default function AddProductScreen({ navigation }: any) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [brand, setBrand] = useState('');
  const [stock, setStock] = useState('1');
  const [condition, setCondition] = useState('Đã qua sử dụng (Còn mới)');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get('/categories');
        const data = response.data.data?.result || response.data.data || response.data;
        setCategories(Array.isArray(data) ? data : []);
        if (data.length > 0) {
          setSelectedCategory(data[0].id);
        }
      } catch (error) {
        console.log('Lỗi tải danh mục:', error);
      }
    };
    fetchCategories();
  }, []);

  const handleSubmit = async () => {
    if (!name || !price || !selectedCategory) {
      Alert.alert('Thông báo', 'Vui lòng điền đầy đủ các thông tin bắt buộc (*)');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        name,
        price: parseFloat(price),
        description,
        image: image || '/uploads/images/default-product.png',
        images: image ? [image] : ['/uploads/images/default-product.png'],
        category_id: selectedCategory,
        brand: brand || 'No Brand',
        stock: parseInt(stock) || 1,
        condition: condition,
        is_freeship: false,
      };

      await api.post('/products', payload);
      Alert.alert('Thành công', 'Đăng sản phẩm thành công!', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error: any) {
      console.log('Lỗi đăng bán sản phẩm:', error);
      Alert.alert('Thất bại', error.response?.data?.message || 'Có lỗi xảy ra khi đăng bán');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.formCard}>
          <Text style={styles.title}>Đăng Bán Đồ Cũ</Text>
          <Text style={styles.subtitle}>Điền thông tin món đồ của em để tìm người mua nhanh nhất</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Tên sản phẩm *</Text>
            <TextInput
              style={styles.input}
              placeholder="Ví dụ: Giáo trình Triết học Mác-Lênin"
              placeholderTextColor={COLORS.textMuted}
              value={name}
              onChangeText={setName}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Giá bán (đọc bằng VNĐ) *</Text>
            <TextInput
              style={styles.input}
              placeholder="Ví dụ: 30000"
              placeholderTextColor={COLORS.textMuted}
              keyboardType="numeric"
              value={price}
              onChangeText={setPrice}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Đường dẫn ảnh sản phẩm (Link URL hoặc bỏ trống)</Text>
            <TextInput
              style={styles.input}
              placeholder="https://example.com/image.jpg"
              placeholderTextColor={COLORS.textMuted}
              value={image}
              onChangeText={setImage}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Danh mục sản phẩm *</Text>
            <View style={styles.categoryPickerContainer}>
              {categories.map((cat) => (
                <TouchableOpacity
                  key={cat.id}
                  style={[
                    styles.categoryItem,
                    selectedCategory === cat.id && styles.categoryItemActive,
                  ]}
                  onPress={() => setSelectedCategory(cat.id)}
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
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Tình trạng sản phẩm</Text>
            <TextInput
              style={styles.input}
              placeholder="Ví dụ: Mới 90%, không vết bẩn"
              placeholderTextColor={COLORS.textMuted}
              value={condition}
              onChangeText={setCondition}
            />
          </View>

          <View style={styles.row}>
            <View style={[styles.inputContainer, { flex: 1, marginRight: SPACING.sm }]}>
              <Text style={styles.label}>Thương hiệu / Hãng</Text>
              <TextInput
                style={styles.input}
                placeholder="Ví dụ: NXB Giáo dục"
                placeholderTextColor={COLORS.textMuted}
                value={brand}
                onChangeText={setBrand}
              />
            </View>
            <View style={[styles.inputContainer, { flex: 1, marginLeft: SPACING.sm }]}>
              <Text style={styles.label}>Số lượng *</Text>
              <TextInput
                style={styles.input}
                placeholder="1"
                placeholderTextColor={COLORS.textMuted}
                keyboardType="numeric"
                value={stock}
                onChangeText={setStock}
              />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Mô tả sản phẩm</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Mô tả chi tiết về sản phẩm để tăng cơ hội chốt đơn nhé..."
              placeholderTextColor={COLORS.textMuted}
              multiline
              numberOfLines={4}
              value={description}
              onChangeText={setDescription}
            />
          </View>

          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} disabled={loading}>
            {loading ? (
              <ActivityIndicator color={COLORS.surface} />
            ) : (
              <Text style={styles.submitButtonText}>Đăng Tin Ngay</Text>
            )}
          </TouchableOpacity>
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
  scrollContent: {
    padding: SPACING.md,
  },
  formCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 24,
    padding: SPACING.md,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 3,
  },
  title: {
    ...TYPOGRAPHY.h1,
    color: COLORS.primary,
  },
  subtitle: {
    ...TYPOGRAPHY.caption,
    fontSize: 14,
    marginBottom: SPACING.lg,
  },
  inputContainer: {
    marginBottom: SPACING.md,
  },
  row: {
    flexDirection: 'row',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  input: {
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: SPACING.md,
    fontSize: 15,
    color: COLORS.text,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  categoryPickerContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: SPACING.xs,
  },
  categoryItem: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 20,
    paddingHorizontal: SPACING.md,
    paddingVertical: 6,
    marginRight: 6,
    marginBottom: 6,
    backgroundColor: COLORS.background,
  },
  categoryItemActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  categoryText: {
    fontSize: 13,
    color: COLORS.text,
  },
  categoryTextActive: {
    color: COLORS.surface,
    fontWeight: '600',
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: SPACING.md,
    alignItems: 'center',
    marginTop: SPACING.md,
  },
  submitButtonText: {
    color: COLORS.surface,
    fontWeight: '700',
    fontSize: 16,
  },
});
