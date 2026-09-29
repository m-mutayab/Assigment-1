import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useOrders } from '../context/OrdersContext';
import { useTheme } from '../context/ThemeContext';
import OrderStatusBar from '../components/OrderStatusBar';

const STATUS_FLOW = ['Pending', 'Preparing', 'Ready', 'Served'];
const STATUS_TIMES = { Pending: 0, Preparing: 10, Ready: 20, Served: 30 };
const STATUS_ICONS = { Pending: '⏳', Preparing: '👨‍🍳', Ready: '✅', Served: '🍽️', Cancelled: '❌' };

const OrderTrackingScreen = () => {
  const { params } = useRoute();
  const { theme } = useTheme();
  const { ordersState, ordersDispatch } = useOrders();
  const navigation = useNavigation();

  const order = ordersState.orders.find((o) => o.id === params?.orderId);
  const [elapsed, setElapsed] = useState(0);
  const intervalRef = useRef(null);
  const statusTimers = useRef([]);

  useEffect(() => {
    if (!order || order.status === 'Cancelled') return;

    // Elapsed timer
    intervalRef.current = setInterval(() => {
      setElapsed((prev) => prev + 1);
    }, 1000);

    // Auto-status progression
    const t1 = setTimeout(() => {
      ordersDispatch({ type: 'UPDATE_ORDER_STATUS', payload: { id: order.id, status: 'Preparing' } });
    }, 10000);
    const t2 = setTimeout(() => {
      ordersDispatch({ type: 'UPDATE_ORDER_STATUS', payload: { id: order.id, status: 'Ready' } });
    }, 20000);
    const t3 = setTimeout(() => {
      ordersDispatch({ type: 'UPDATE_ORDER_STATUS', payload: { id: order.id, status: 'Served' } });
    }, 30000);

    statusTimers.current = [t1, t2, t3];

    return () => {
      clearInterval(intervalRef.current);
      statusTimers.current.forEach(clearTimeout);
    };
  }, [order?.id]);

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const s = styles(theme);

  if (!order) {
    return (
      <View style={[s.center, { backgroundColor: theme.background }]}>
        <Text style={{ color: theme.textSecondary }}>Order not found.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={[s.container, { backgroundColor: theme.background }]} contentContainerStyle={{ paddingBottom: 40 }}>
      {/* Header */}
      <View style={[s.card, { backgroundColor: theme.card }]}>
        <Text style={[s.orderId, { color: theme.textSecondary }]}>Order #{order.id.slice(-6).toUpperCase()}</Text>
        <Text style={[s.statusIcon]}>{STATUS_ICONS[order.status] || '⏳'}</Text>
        <Text style={[s.statusLabel, { color: theme.primary }]}>{order.status}</Text>
        <Text style={[s.elapsed, { color: theme.textSecondary }]}>⏱ Elapsed: {formatTime(elapsed)}</Text>
        <Text style={[s.type, { color: theme.textSecondary }]}>
          {order.type === 'Dine-in' ? '🍽️ Dine-in' : '🥡 Takeaway'}
          {order.tableId ? ` • Table ${order.tableId}` : ''}
          {order.pickupTime ? ` • Pickup: ${order.pickupTime}` : ''}
        </Text>
      </View>

      {/* Progress Bar */}
      <View style={[s.card, { backgroundColor: theme.card }]}>
        <Text style={[s.sectionTitle, { color: theme.text }]}>Order Progress</Text>
        <OrderStatusBar status={order.status} />
      </View>

      {/* Items */}
      <View style={[s.card, { backgroundColor: theme.card }]}>
        <Text style={[s.sectionTitle, { color: theme.text }]}>Items Ordered</Text>
        {order.items.map((item) => (
          <View key={item.id} style={s.itemRow}>
            <Text style={{ color: theme.text }}>{item.name} × {item.quantity}</Text>
            <Text style={{ color: theme.primary, fontWeight: '700' }}>Rs. {item.price * item.quantity}</Text>
          </View>
        ))}
      </View>

      {/* Bill */}
      <View style={[s.card, { backgroundColor: theme.card }]}>
        <Text style={[s.sectionTitle, { color: theme.text }]}>Bill</Text>
        <View style={s.itemRow}>
          <Text style={{ color: theme.textSecondary }}>Subtotal</Text>
          <Text style={{ color: theme.text }}>Rs. {order.subtotal?.toFixed(0)}</Text>
        </View>
        <View style={s.itemRow}>
          <Text style={{ color: theme.textSecondary }}>Service + Tax</Text>
          <Text style={{ color: theme.text }}>Rs. {((order.serviceCharge || 0) + (order.tax || 0)).toFixed(0)}</Text>
        </View>
        {order.promoDiscount > 0 && (
          <View style={s.itemRow}>
            <Text style={{ color: theme.success }}>Promo</Text>
            <Text style={{ color: theme.success }}>−Rs. {order.promoDiscount.toFixed(0)}</Text>
          </View>
        )}
        <View style={[s.itemRow, { borderTopWidth: 1, borderTopColor: theme.border, marginTop: 6, paddingTop: 8 }]}>
          <Text style={{ color: theme.text, fontWeight: '800', fontSize: 16 }}>Total</Text>
          <Text style={{ color: theme.primary, fontWeight: '800', fontSize: 18 }}>Rs. {order.total?.toFixed(0)}</Text>
        </View>
      </View>

      <TouchableOpacity style={[s.backBtn, { borderColor: theme.primary }]} onPress={() => navigation.navigate('Menu')}>
        <Text style={{ color: theme.primary, fontWeight: '700' }}>← Back to Menu</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = (theme) => StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  card: {
    margin: 12, borderRadius: 12, padding: 16,
    elevation: 2, shadowColor: theme.shadow,
    shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 3,
    alignItems: 'center',
  },
  orderId: { fontSize: 12, marginBottom: 8 },
  statusIcon: { fontSize: 48, marginBottom: 6 },
  statusLabel: { fontSize: 22, fontWeight: '800', marginBottom: 4 },
  elapsed: { fontSize: 13, marginBottom: 4 },
  type: { fontSize: 13 },
  sectionTitle: { fontSize: 15, fontWeight: '800', marginBottom: 12, alignSelf: 'flex-start' },
  itemRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', paddingVertical: 4 },
  backBtn: {
    margin: 16, padding: 14, borderRadius: 12,
    borderWidth: 2, alignItems: 'center',
  },
});

export default OrderTrackingScreen;
