import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ActivityIndicator, View, StyleSheet, Text } from 'react-native';

import { AuthContext, AuthProvider } from '../context/AuthContext';
import { CartProvider } from '../context/CartContext';
import { COLORS } from '../theme/theme';

// Screens
import HomeScreen from '../screens/HomeScreen';
import ProductDetailScreen from '../screens/ProductDetailScreen';
import CartScreen from '../screens/CartScreen';
import ProfileScreen from '../screens/ProfileScreen';
import AddProductScreen from '../screens/AddProductScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Bottom Tabs Navigator for Authenticated Users
function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: true,
        headerTintColor: COLORS.primary,
        headerStyle: {
          backgroundColor: COLORS.surface,
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textMuted,
        tabBarStyle: {
          backgroundColor: COLORS.surface,
          borderTopWidth: 1,
          borderTopColor: COLORS.border,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{
          title: 'Trang Chủ',
          tabBarLabel: 'Trang Chủ',
          tabBarIcon: ({ color }: any) => <Text style={{ color, fontSize: 20 }}>🏠</Text>,
        }}
      />
      <Tab.Screen
        name="CartTab"
        component={CartScreen}
        options={{
          title: 'Giỏ Hàng',
          tabBarLabel: 'Giỏ Hàng',
          tabBarIcon: ({ color }: any) => <Text style={{ color, fontSize: 20 }}>🛒</Text>,
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{
          title: 'Cá Nhân',
          tabBarLabel: 'Cá Nhân',
          tabBarIcon: ({ color }: any) => <Text style={{ color, fontSize: 20 }}>👤</Text>,
        }}
      />
    </Tab.Navigator>
  );
}

// Auth Stack for Unauthenticated Users
function AuthNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: COLORS.background },
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
}

// Root Navigation Router
function NavigationRouter() {
  const authContext = useContext(AuthContext);

  if (authContext?.isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {authContext?.token ? (
          // Main flow if logged in
          <>
            <Stack.Screen name="Main" component={MainTabNavigator} />
            <Stack.Screen
              name="ProductDetail"
              component={ProductDetailScreen}
              options={{
                headerShown: true,
                title: 'Chi Tiết Sản Phẩm',
                headerTintColor: COLORS.primary,
                headerStyle: { backgroundColor: COLORS.surface },
              }}
            />
            <Stack.Screen
              name="AddProduct"
              component={AddProductScreen}
              options={{
                headerShown: true,
                title: 'Đăng Bán Sản Phẩm',
                headerTintColor: COLORS.primary,
                headerStyle: { backgroundColor: COLORS.surface },
              }}
            />
          </>
        ) : (
          // Login/Register flow
          <Stack.Screen name="Auth" component={AuthNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function AppNavigator() {
  return (
    <AuthProvider>
      <CartProvider>
        <NavigationRouter />
      </CartProvider>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
});
