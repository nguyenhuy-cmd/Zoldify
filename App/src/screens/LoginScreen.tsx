import React, { useState, useContext } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { COLORS, TYPOGRAPHY, SPACING } from '../theme/theme';

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const authContext = useContext(AuthContext);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Thông báo', 'Vui lòng nhập đầy đủ email và mật khẩu');
      return;
    }
    setLoading(true);
    try {
      await authContext?.login(email, password);
    } catch (error: any) {
      Alert.alert('Đăng nhập thất bại', error.message || 'Đã có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={styles.appName}>Zoldify</Text>
          <Text style={styles.tagline}>Đồ Cũ, Vẫn CHẤT</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.title}>Đăng Nhập</Text>
          <Text style={styles.subtitle}>Chào mừng em trở lại với hệ thống mua bán đồ cũ sinh viên</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email sinh viên</Text>
            <TextInput
              style={styles.input}
              placeholder="VD: nguyenvana@student.com"
              placeholderTextColor={COLORS.textMuted}
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Mật khẩu</Text>
            <TextInput
              style={styles.input}
              placeholder="Nhập mật khẩu"
              placeholderTextColor={COLORS.textMuted}
              secureTextEntry
              autoCapitalize="none"
              value={password}
              onChangeText={setPassword}
            />
          </View>

          <TouchableOpacity style={styles.loginButton} onPress={handleLogin} disabled={loading}>
            {loading ? (
              <ActivityIndicator color={COLORS.surface} />
            ) : (
              <Text style={styles.loginButtonText}>Đăng Nhập</Text>
            )}
          </TouchableOpacity>

          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>Chưa có tài khoản? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={styles.registerLink}>Đăng ký ngay</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: SPACING.lg,
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  appName: {
    fontSize: 42,
    fontWeight: '800',
    color: COLORS.primary,
    letterSpacing: 1.5,
  },
  tagline: {
    fontSize: 16,
    color: COLORS.textMuted,
    fontWeight: '600',
    marginTop: SPACING.xs,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 24,
    padding: SPACING.lg,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 24,
    elevation: 4,
  },
  title: {
    ...TYPOGRAPHY.h1,
    marginBottom: SPACING.xs,
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
    fontSize: 16,
    color: COLORS.text,
  },
  loginButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    padding: SPACING.md,
    alignItems: 'center',
    marginTop: SPACING.md,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 3,
  },
  loginButtonText: {
    ...TYPOGRAPHY.buttonText,
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: SPACING.lg,
  },
  registerText: {
    color: COLORS.textMuted,
  },
  registerLink: {
    color: COLORS.primary,
    fontWeight: '700',
  },
});
