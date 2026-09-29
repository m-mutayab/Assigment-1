import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';

import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

import LoginScreen from '../screens/LoginScreen';
import MenuScreen from '../screens/MenuScreen';
import CartScreen from '../screens/CartScreen';
import OrderSummaryScreen from '../screens/OrderSummaryScreen';
import OrderTrackingScreen from '../screens/OrderTrackingScreen';
import ReservationScreen from '../screens/ReservationScreen';
import ProfileScreen from '../screens/ProfileScreen';
import ManagerDashboardScreen from '../screens/ManagerDashboardScreen';
import LoadingScreen from '../components/LoadingScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const tabIcon = (name) => {
  const icons = { Menu: '🍽️', Reservations: '📅', Profile: '👤', Dashboard: '📊' };
  return ({ focused }) => <Text style={{ fontSize: 22, opacity: focused ? 1 : 0.5 }}>{icons[name]}</Text>;
};

const CustomerTabs = () => {
  const { theme } = useTheme();
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: { backgroundColor: theme.tabBar, borderTopColor: theme.border },
        tabBarActiveTintColor: theme.tabBarActive,
        tabBarInactiveTintColor: theme.tabBarInactive,
        headerStyle: { backgroundColor: theme.surface },
        headerTintColor: theme.text,
        headerTitleStyle: { fontWeight: '700' },
        tabBarShowLabel: true,
      }}
    >
      <Tab.Screen name="Menu" component={MenuStack} options={{ headerShown: false, tabBarIcon: tabIcon('Menu') }} />
      <Tab.Screen name="Reservations" component={ReservationScreen} options={{ tabBarIcon: tabIcon('Reservations'), title: '📅 Reservations' }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ tabBarIcon: tabIcon('Profile'), title: '👤 Profile' }} />
    </Tab.Navigator>
  );
};

const ManagerTabs = () => {
  const { theme } = useTheme();
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: { backgroundColor: theme.tabBar, borderTopColor: theme.border },
        tabBarActiveTintColor: theme.tabBarActive,
        tabBarInactiveTintColor: theme.tabBarInactive,
        headerStyle: { backgroundColor: theme.surface },
        headerTintColor: theme.text,
        headerTitleStyle: { fontWeight: '700' },
      }}
    >
      <Tab.Screen name="Dashboard" component={ManagerDashboardScreen} options={{ tabBarIcon: tabIcon('Dashboard'), title: '📊 Dashboard' }} />
      <Tab.Screen name="Menu" component={MenuStack} options={{ headerShown: false, tabBarIcon: tabIcon('Menu') }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ tabBarIcon: tabIcon('Profile'), title: '👤 Profile' }} />
    </Tab.Navigator>
  );
};

const MenuStack = () => {
  const { theme } = useTheme();
  return (
    <Stack.Navigator screenOptions={{ headerStyle: { backgroundColor: theme.surface }, headerTintColor: theme.text, headerTitleStyle: { fontWeight: '700' } }}>
      <Stack.Screen name="MenuList" component={MenuScreen} options={{ title: 'Menu' }} />
      <Stack.Screen name="Cart" component={CartScreen} options={{ title: '🛒 Your Cart' }} />
      <Stack.Screen name="OrderSummary" component={OrderSummaryScreen} options={{ title: '📋 Order Summary' }} />
      <Stack.Screen name="OrderTracking" component={OrderTrackingScreen} options={{ title: '📦 Order Tracking' }} />
    </Stack.Navigator>
  );
};

const AppNavigator = () => {
  const { currentUser } = useAuth();
  const { theme } = useTheme();

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!currentUser ? (
          <Stack.Screen name="Login" component={LoginScreen} />
        ) : currentUser.role === 'manager' ? (
          <Stack.Screen name="ManagerRoot">
            {() => (
              <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name="ManagerTabs" component={ManagerTabs} />
                <Stack.Screen name="OrderTracking" component={OrderTrackingScreen} options={{ headerShown: true, title: '📦 Order Tracking', headerStyle: { backgroundColor: theme.surface }, headerTintColor: theme.text }} />
              </Stack.Navigator>
            )}
          </Stack.Screen>
        ) : (
          <Stack.Screen name="CustomerRoot" component={CustomerTabs} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
