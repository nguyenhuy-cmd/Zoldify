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

export default function RegisterScreen({ navigation }: any) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const authContext = useContext(AuthContext);

  const handleRegister = async () => {
    if (!fullName || !email || !password) {
      Alert.alert('Thông báo', 'Vui lòng điền đầy đủ các thông tin bắt buộc (*)');
      return;
    }
    setLoading(true);
    try {
      await authContext?.register(fullName, email, password, phoneNumber);
      Alert.alert('Thành công', 'Đăng ký tài khoản thành công!');
    } catch (error: any) {
      Alert.alert('Đăng ký thất bại', error.message || 'Đã có lỗi xảy ra');
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
        <View style={styles.card}>
          <Text style={styles.title}>Đăng Ký Tài Khoản</Text>
          <Text style={styles.subtitle}>Tạo tài khoản mới để bắt đầu mua bán đồ dùng sinh viên</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Họ và tên *</Text>
            <TextInput
              style={styles.input}
              placeholder="VD: Nguyễn Văn A"
              placeholderTextColor={COLORS.textMuted}
              value={fullName}
              onChangeText={setFullName}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email sinh viên *</Text>
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
            <Text style={styles.label}>Số điện thoại</Text>
            <TextInput
              style={styles.input}
              placeholder="VD: 0987654321"
              placeholderTextColor={COLORS.textMuted}
              keyboardType="phone-pad"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Mật khẩu (tối thiểu 6 ký tự) *</Text>
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

          <TouchableOpacity style={styles.registerButton} onPress={handleRegister} disabled={loading}>
            {loading ? (
              <ActivityIndicator color={COLORS.surface} />
            ) : (
              <Text style={styles.registerButtonText}>Đăng Ký</Text>
            )}
          </TouchableOpacity>

          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Đã có tài khoản? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.loginLink}>Đăng nhập</Text>
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
  registerButton: {
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
  registerButtonText: {
    ...TYPOGRAPHY.buttonText,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: SPACING.lg,
  },
  loginText: {
    color: COLORS.textMuted,
  },
  loginLink: {
    color: COLORS.primary,
    fontWeight: '700',
  },
});
