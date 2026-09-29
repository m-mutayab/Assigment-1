import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Switch, ScrollView, Alert } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useOrders } from '../context/OrdersContext';
import { useReservations } from '../context/ReservationsContext';
import { useNavigation } from '@react-navigation/native';

const ProfileScreen = () => {
  const { currentUser, logout } = useAuth();
  const { theme, isDark, toggleTheme } = useTheme();
  const { ordersState } = useOrders();
  const { reservations } = useReservations();
  const navigation = useNavigation();

  const myOrders = ordersState.orders.filter((o) => o.userId === currentUser?.id);
  const myReservations = reservations.filter((r) => r.userId === currentUser?.id);

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: logout },
    ]);
  };

  const s = styles(theme);

  return (
    <ScrollView style={[s.container, { backgroundColor: theme.background }]} contentContainerStyle={{ paddingBottom: 40 }}>
      {/* Avatar */}
      <View style={[s.avatarSection, { backgroundColor: theme.primary }]}>
        <View style={s.avatar}>
          <Text style={s.avatarText}>{currentUser?.name?.charAt(0).toUpperCase()}</Text>
        </View>
        <Text style={s.userName}>{currentUser?.name}</Text>
        <Text style={s.userEmail}>{currentUser?.email}</Text>
        <View style={[s.roleBadge, { backgroundColor: currentUser?.role === 'manager' ? '#F39C12' : '#27AE60' }]}>
          <Text style={s.roleText}>{currentUser?.role === 'manager' ? '👨‍💼 Manager' : '👤 Customer'}</Text>
        </View>
      </View>

      {/* Stats */}
      <View style={[s.statsRow, { backgroundColor: theme.card }]}>
        <View style={s.stat}>
          <Text style={[s.statNum, { color: theme.primary }]}>{myOrders.length}</Text>
          <Text style={[s.statLabel, { color: theme.textSecondary }]}>Orders</Text>
        </View>
        <View style={[s.statDivider, { backgroundColor: theme.border }]} />
        <View style={s.stat}>
          <Text style={[s.statNum, { color: theme.primary }]}>{myReservations.length}</Text>
          <Text style={[s.statLabel, { color: theme.textSecondary }]}>Reservations</Text>
        </View>
        <View style={[s.statDivider, { backgroundColor: theme.border }]} />
        <View style={s.stat}>
          <Text style={[s.statNum, { color: theme.primary }]}>
            Rs. {myOrders.reduce((sum, o) => sum + (o.total || 0), 0).toFixed(0)}
          </Text>
          <Text style={[s.statLabel, { color: theme.textSecondary }]}>Spent</Text>
        </View>
      </View>

      {/* Settings */}
      <View style={[s.section, { backgroundColor: theme.card }]}>
        <Text style={[s.sectionTitle, { color: theme.text }]}>Settings</Text>
        <View style={s.settingRow}>
          <Text style={[s.settingLabel, { color: theme.text }]}>🌙 Dark Mode</Text>
          <Switch
            value={isDark}
            onValueChange={toggleTheme}
            trackColor={{ false: theme.border, true: theme.primaryLight }}
            thumbColor={isDark ? theme.primary : '#f4f3f4'}
          />
        </View>
      </View>

      {/* Manager Dashboard */}
      {currentUser?.role === 'manager' && (
        <TouchableOpacity
          style={[s.managerBtn, { backgroundColor: '#F39C12' }]}
          onPress={() => navigation.navigate('Dashboard')}
        >
          <Text style={s.managerText}>👨‍💼 Manager Dashboard</Text>
        </TouchableOpacity>
      )}

      {/* My Orders */}
      {myOrders.length > 0 && (
        <View style={[s.section, { backgroundColor: theme.card }]}>
          <Text style={[s.sectionTitle, { color: theme.text }]}>Recent Orders</Text>
          {myOrders.slice(0, 3).map((order) => (
            <TouchableOpacity
              key={order.id}
              style={[s.orderRow, { borderBottomColor: theme.border }]}
              onPress={() => navigation.navigate('OrderTracking', { orderId: order.id })}
            >
              <View>
                <Text style={{ color: theme.text, fontWeight: '600' }}>#{order.id.slice(-6).toUpperCase()}</Text>
                <Text style={{ color: theme.textSecondary, fontSize: 12 }}>{order.type} • {order.items.length} items</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={{ color: theme.primary, fontWeight: '700' }}>Rs. {order.total?.toFixed(0)}</Text>
                <Text style={[s.orderStatus, { color: order.status === 'Served' ? theme.success : theme.warning }]}>
                  {order.status}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Logout */}
      <TouchableOpacity style={[s.logoutBtn, { borderColor: theme.error }]} onPress={handleLogout}>
        <Text style={{ color: theme.error, fontWeight: '700', fontSize: 16 }}>🚪 Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = (theme) => StyleSheet.create({
  container: { flex: 1 },
  avatarSection: { alignItems: 'center', paddingVertical: 32, paddingBottom: 40 },
  avatar: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.3)', alignItems: 'center', justifyContent: 'center', marginBottom: 12,
  },
  avatarText: { fontSize: 36, color: '#fff', fontWeight: '700' },
  userName: { color: '#fff', fontSize: 22, fontWeight: '800' },
  userEmail: { color: 'rgba(255,255,255,0.8)', fontSize: 14, marginTop: 2 },
  roleBadge: { marginTop: 10, paddingHorizontal: 14, paddingVertical: 4, borderRadius: 12 },
  roleText: { color: '#fff', fontWeight: '700', fontSize: 13 },
  statsRow: {
    flexDirection: 'row', margin: 12, borderRadius: 12, padding: 16,
    elevation: 2, shadowColor: theme.shadow, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 3,
  },
  stat: { flex: 1, alignItems: 'center' },
  statNum: { fontSize: 20, fontWeight: '800' },
  statLabel: { fontSize: 12, marginTop: 2 },
  statDivider: { width: 1, marginHorizontal: 8 },
  section: {
    margin: 12, borderRadius: 12, padding: 16,
    elevation: 2, shadowColor: theme.shadow, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 3,
  },
  sectionTitle: { fontSize: 16, fontWeight: '800', marginBottom: 12 },
  settingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  settingLabel: { fontSize: 15 },
  managerBtn: { margin: 12, borderRadius: 12, padding: 16, alignItems: 'center' },
  managerText: { color: '#fff', fontWeight: '800', fontSize: 16 },
  orderRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1 },
  orderStatus: { fontSize: 12, fontWeight: '600', marginTop: 2 },
  logoutBtn: { margin: 16, borderWidth: 2, borderRadius: 12, padding: 16, alignItems: 'center' },
});

export default ProfileScreen;
