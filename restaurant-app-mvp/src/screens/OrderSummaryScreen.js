import React, { useState, useMemo, useCallback, memo } from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  StyleSheet, Alert, ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import { useOrders } from '../context/OrdersContext';
import { useAuth } from '../context/AuthContext';
import { tables } from '../data/menuData';

const SERVICE_CHARGE_RATE = 0.05;
const TAX_RATE = 0.15;

const OrderItemRow = memo(({ item, isFav, onToggleFav, theme }) => (
  <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: theme.border }}>
    <View style={{ flex: 1 }}>
      <Text style={{ color: theme.text, fontWeight: '600' }}>{item.name} × {item.quantity}</Text>
      {item.note ? <Text style={{ color: theme.textLight, fontSize: 11 }}>{item.note}</Text> : null}
    </View>
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <TouchableOpacity onPress={() => onToggleFav(item.id)} style={{ marginRight: 10 }}>
        <Text>{isFav ? '❤️' : '🤍'}</Text>
      </TouchableOpacity>
      <Text style={{ color: theme.primary, fontWeight: '700' }}>Rs. {item.price * item.quantity}</Text>
    </View>
  </View>
));

const OrderSummaryScreen = () => {
  const { cartState, cartDispatch, subtotal } = useCart();
  const { theme } = useTheme();
  const { ordersDispatch } = useOrders();
  const { currentUser } = useAuth();
  const navigation = useNavigation();

  const [orderType, setOrderType] = useState('Dine-in');
  const [tableId, setTableId] = useState('');
  const [pickupTime, setPickupTime] = useState('');
  const [favourites, setFavourites] = useState([]);
  const [sortOrder, setSortOrder] = useState('default');

  const serviceCharge = useMemo(() => subtotal * SERVICE_CHARGE_RATE, [subtotal]);
  const tax = useMemo(() => subtotal * TAX_RATE, [subtotal]);
  const promoDiscount = useMemo(
    () => (cartState.promo ? subtotal * cartState.promo.discount : 0),
    [cartState.promo, subtotal]
  );
  const grandTotal = useMemo(
    () => subtotal + serviceCharge + tax - promoDiscount,
    [subtotal, serviceCharge, tax, promoDiscount]
  );

  const sortedItems = useMemo(() => {
    const items = [...cartState.items];
    if (sortOrder === 'price_asc') return items.sort((a, b) => a.price - b.price);
    if (sortOrder === 'price_desc') return items.sort((a, b) => b.price - a.price);
    return items;
  }, [cartState.items, sortOrder]);

  const toggleFavourite = useCallback((id) => {
    setFavourites((prev) => prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]);
  }, []);

  const placeOrder = useCallback(() => {
    if (orderType === 'Dine-in' && !tableId) {
      Alert.alert('Select Table', 'Please select a table for Dine-in.'); return;
    }
    if (orderType === 'Takeaway' && !pickupTime) {
      Alert.alert('Pickup Time', 'Please enter a pickup time.'); return;
    }
    const order = {
      id: `ord${Date.now()}`,
      userId: currentUser?.id,
      items: cartState.items,
      subtotal,
      serviceCharge,
      tax,
      promoDiscount,
      total: grandTotal,
      promo: cartState.promo,
      type: orderType,
      tableId: orderType === 'Dine-in' ? tableId : null,
      pickupTime: orderType === 'Takeaway' ? pickupTime : null,
      status: 'Pending',
      timestamp: new Date().toISOString(),
    };
    ordersDispatch({ type: 'ADD_ORDER', payload: order });
    cartDispatch({ type: 'CLEAR_CART' });
    navigation.navigate('OrderTracking', { orderId: order.id });
  }, [orderType, tableId, pickupTime, cartState, subtotal, serviceCharge, tax, promoDiscount, grandTotal, currentUser]);

  const { theme: t } = { theme };
  const s = styles(theme);

  const PICKUP_SLOTS = ['12:00', '12:30', '13:00', '13:30', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00'];

  return (
    <ScrollView style={[s.container, { backgroundColor: theme.background }]} contentContainerStyle={{ paddingBottom: 40 }}>
      {/* Order Type */}
      <View style={s.section}>
        <Text style={[s.sectionTitle, { color: theme.text }]}>Order Type</Text>
        <View style={s.typeRow}>
          {['Dine-in', 'Takeaway'].map((type) => (
            <TouchableOpacity
              key={type}
              style={[s.typeBtn, { backgroundColor: orderType === type ? theme.primary : theme.chipBg }]}
              onPress={() => setOrderType(type)}
            >
              <Text style={{ color: orderType === type ? '#fff' : theme.text, fontWeight: '700' }}>
                {type === 'Dine-in' ? '🍽️ ' : '🥡 '}{type}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {orderType === 'Dine-in' && (
          <View>
            <Text style={[s.subLabel, { color: theme.textSecondary }]}>Select Table</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {tables.map((table) => (
                <TouchableOpacity
                  key={table.id}
                  style={[s.tableChip, { backgroundColor: tableId === table.id ? theme.primary : theme.chipBg }]}
                  onPress={() => setTableId(table.id)}
                >
                  <Text style={{ color: tableId === table.id ? '#fff' : theme.text, fontWeight: '600', fontSize: 13 }}>
                    T{table.tableNumber} ({table.seats} seats)
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {orderType === 'Takeaway' && (
          <View>
            <Text style={[s.subLabel, { color: theme.textSecondary }]}>Pickup Time</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {PICKUP_SLOTS.map((slot) => (
                <TouchableOpacity
                  key={slot}
                  style={[s.tableChip, { backgroundColor: pickupTime === slot ? theme.primary : theme.chipBg }]}
                  onPress={() => setPickupTime(slot)}
                >
                  <Text style={{ color: pickupTime === slot ? '#fff' : theme.text, fontWeight: '600' }}>{slot}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
      </View>

      {/* Sort */}
      <View style={s.section}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
          <Text style={[s.sectionTitle, { color: theme.text, flex: 1 }]}>Your Items</Text>
          <View style={{ flexDirection: 'row' }}>
            {[['default','↕️'],['price_asc','↑Rs'],['price_desc','↓Rs']].map(([k,l]) => (
              <TouchableOpacity key={k} onPress={() => setSortOrder(k)}
                style={[s.sortBtn, { backgroundColor: sortOrder === k ? theme.primary : theme.chipBg }]}>
                <Text style={{ color: sortOrder === k ? '#fff' : theme.text, fontSize: 11 }}>{l}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        {sortedItems.map((item) => (
          <OrderItemRow
            key={item.id}
            item={item}
            isFav={favourites.includes(item.id)}
            onToggleFav={toggleFavourite}
            theme={theme}
          />
        ))}
      </View>

      {/* Summary */}
      <View style={[s.section, { backgroundColor: theme.card }]}>
        <Text style={[s.sectionTitle, { color: theme.text }]}>Bill Summary</Text>
        {[
          ['Subtotal', subtotal],
          [`Service Charge (${SERVICE_CHARGE_RATE * 100}%)`, serviceCharge],
          [`Sales Tax (${TAX_RATE * 100}%)`, tax],
        ].map(([label, val]) => (
          <View key={label} style={s.billRow}>
            <Text style={{ color: theme.textSecondary }}>{label}</Text>
            <Text style={{ color: theme.text }}>Rs. {val.toFixed(0)}</Text>
          </View>
        ))}
        {cartState.promo && (
          <View style={s.billRow}>
            <Text style={{ color: theme.success }}>Promo ({cartState.promo.code})</Text>
            <Text style={{ color: theme.success }}>−Rs. {promoDiscount.toFixed(0)}</Text>
          </View>
        )}
        <View style={[s.billRow, s.totalRow]}>
          <Text style={[s.totalLabel, { color: theme.text }]}>Grand Total</Text>
          <Text style={[s.totalAmount, { color: theme.primary }]}>Rs. {grandTotal.toFixed(0)}</Text>
        </View>
      </View>

      <TouchableOpacity style={[s.placeBtn, { backgroundColor: theme.primary }]} onPress={placeOrder}>
        <Text style={s.placeText}>🍽️ Place Order</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = (theme) => StyleSheet.create({
  container: { flex: 1 },
  section: {
    margin: 12, backgroundColor: theme.card,
    borderRadius: 12, padding: 14,
    elevation: 2, shadowColor: theme.shadow, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 3,
  },
  sectionTitle: { fontSize: 16, fontWeight: '800', marginBottom: 12 },
  typeRow: { flexDirection: 'row', gap: 12 },
  typeBtn: { flex: 1, paddingVertical: 12, borderRadius: 10, alignItems: 'center' },
  subLabel: { fontSize: 13, fontWeight: '600', marginTop: 14, marginBottom: 8 },
  tableChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10, marginRight: 8 },
  sortBtn: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, marginLeft: 4 },
  billRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6 },
  totalRow: { borderTopWidth: 1, borderTopColor: theme.border, marginTop: 6, paddingTop: 10 },
  totalLabel: { fontSize: 16, fontWeight: '800' },
  totalAmount: { fontSize: 20, fontWeight: '800' },
  placeBtn: { margin: 16, padding: 16, borderRadius: 14, alignItems: 'center' },
  placeText: { color: '#fff', fontWeight: '800', fontSize: 17 },
});

export default OrderSummaryScreen;
