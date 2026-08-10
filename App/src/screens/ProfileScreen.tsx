import React, { useContext } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { COLORS, TYPOGRAPHY, SPACING } from '../theme/theme';

export default function ProfileScreen({ navigation }: any) {
  const authContext = useContext(AuthContext);
  const { user, logout } = authContext || { user: null, logout: async () => {} };

  const handleLogout = () => {
    Alert.alert('Đăng xuất', 'Em có chắc chắn muốn đăng xuất tài khoản?', [
      { text: 'Hủy', style: 'cancel' },
      {
        text: 'Đăng xuất',
        style: 'destructive',
        onPress: async () => {
          await logout();
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.profileHeader}>
        <View style={styles.avatarPlaceholder}>
          <Text style={styles.avatarText}>
            {user?.full_name?.charAt(0).toUpperCase() || 'U'}
          </Text>
        </View>
        <Text style={styles.userName}>{user?.full_name || 'Người dùng Zoldify'}</Text>
        <Text style={styles.userEmail}>{user?.email || ''}</Text>
        
        <View style={styles.roleBadge}>
          <Text style={styles.roleText}>
            {user?.role === 'admin' ? 'Quản trị viên' : 'Sinh viên'}
          </Text>
        </View>
      </View>

      <View style={styles.menuContainer}>
        {/* Chỉ dành cho người bán / sinh viên muốn đăng bán đồ cũ */}
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('AddProduct')}
        >
          <Text style={styles.menuItemText}>🎒 Đăng bán sản phẩm cũ</Text>
        </TouchableOpacity>

        {/* Các mục khác */}
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => Alert.alert('Tính năng', 'Tính năng đang được phát triển')}
        >
          <Text style={styles.menuItemText}>📦 Đơn hàng đã mua</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => Alert.alert('Tính năng', 'Tính năng đang được phát triển')}
        >
          <Text style={styles.menuItemText}>❤️ Sản phẩm yêu thích</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Đăng Xuất</Text>
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
  profileHeader: {
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    paddingVertical: SPACING.xl,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 4,
  },
  avatarPlaceholder: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  avatarText: {
    color: COLORS.surface,
    fontSize: 36,
    fontWeight: '800',
  },
  userName: {
    ...TYPOGRAPHY.h1,
    color: COLORS.text,
  },
  userEmail: {
    fontSize: 14,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  roleBadge: {
    marginTop: SPACING.sm,
    backgroundColor: 'rgba(109, 40, 217, 0.1)',
    paddingHorizontal: SPACING.md,
    paddingVertical: 4,
    borderRadius: 12,
  },
  roleText: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: '700',
  },
  menuContainer: {
    padding: SPACING.lg,
    marginTop: SPACING.lg,
  },
  menuItem: {
    backgroundColor: COLORS.surface,
    padding: SPACING.md,
    borderRadius: 16,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  menuItemText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  logoutButton: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderRadius: 16,
    padding: SPACING.md,
    alignItems: 'center',
    marginTop: SPACING.xl,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.2)',
  },
  logoutText: {
    color: COLORS.error,
    fontWeight: '700',
    fontSize: 16,
  },
});
