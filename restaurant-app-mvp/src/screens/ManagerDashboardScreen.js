import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, TextInput,
  StyleSheet, Modal, Alert,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useOrders } from '../context/OrdersContext';
import { useReservations } from '../context/ReservationsContext';
import { useMenu } from '../context/MenuContext';

const TABS = ['Orders', 'Reservations', 'Menu'];
const ORDER_STATUSES = ['Pending', 'Preparing', 'Ready', 'Served', 'Cancelled'];
const STATUS_COLORS = {
  Pending: '#F39C12', Preparing: '#3498DB', Ready: '#27AE60', Served: '#8E44AD', Cancelled: '#E74C3C',
};

const ManagerDashboardScreen = () => {
  const { theme } = useTheme();
  const { ordersState, ordersDispatch } = useOrders();
  const { reservations, updateReservationStatus } = useReservations();
  const { menuItems, updatePrice, toggleAvailability, addMenuItem } = useMenu();

  const [activeTab, setActiveTab] = useState('Orders');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newItem, setNewItem] = useState({ name: '', description: '', price: '', category: 'mains' });
  const [editingPrice, setEditingPrice] = useState({});

  const handleStatusChange = (orderId, status) => {
    ordersDispatch({ type: 'UPDATE_ORDER_STATUS', payload: { id: orderId, status } });
  };

  const handleResAction = (id, status) => {
    Alert.alert(`${status === 'confirmed' ? 'Accept' : 'Decline'} Reservation`, 'Confirm?', [
      { text: 'No', style: 'cancel' },
      { text: 'Yes', onPress: () => updateReservationStatus(id, status) },
    ]);
  };

  const handleAddItem = () => {
    if (!newItem.name || !newItem.price) {
      Alert.alert('Missing Info', 'Name and price are required.'); return;
    }
    addMenuItem({
      ...newItem,
      price: parseFloat(newItem.price),
      isAvailable: true, isSpecial: false,
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400',
      id: `m${Date.now()}`,
    });
    setNewItem({ name: '', description: '', price: '', category: 'mains' });
    setShowAddModal(false);
  };

  const handlePriceEdit = (id, price) => {
    setEditingPrice((prev) => ({ ...prev, [id]: price }));
  };

  const savePrice = (id) => {
    const p = editingPrice[id];
    if (p && !isNaN(parseFloat(p))) {
      updatePrice(id, parseFloat(p));
    }
    setEditingPrice((prev) => { const n = { ...prev }; delete n[id]; return n; });
  };

  const s = styles(theme);

  return (
    <View style={[s.container, { backgroundColor: theme.background }]}>
      {/* Tabs */}
      <View style={[s.tabBar, { backgroundColor: theme.card }]}>
        {TABS.map((t) => (
          <TouchableOpacity key={t} style={[s.tabBtn, activeTab === t && { borderBottomColor: theme.primary, borderBottomWidth: 3 }]} onPress={() => setActiveTab(t)}>
            <Text style={{ color: activeTab === t ? theme.primary : theme.textSecondary, fontWeight: '700' }}>{t}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={{ padding: 12, paddingBottom: 40 }}>
        {/* ORDERS TAB */}
        {activeTab === 'Orders' && (
          <>
            <Text style={[s.tabTitle, { color: theme.text }]}>Incoming Orders ({ordersState.orders.length})</Text>
            {ordersState.orders.length === 0 ? (
              <View style={s.empty}><Text style={{ color: theme.textSecondary }}>No orders yet.</Text></View>
            ) : (
              ordersState.orders.map((order) => (
                <View key={order.id} style={[s.card, { backgroundColor: theme.card }]}>
                  <View style={s.cardHeader}>
                    <Text style={[s.cardId, { color: theme.text }]}>#{order.id.slice(-6).toUpperCase()}</Text>
                    <View style={[s.statusPill, { backgroundColor: STATUS_COLORS[order.status] + '22' }]}>
                      <Text style={[s.statusPillText, { color: STATUS_COLORS[order.status] }]}>{order.status}</Text>
                    </View>
                  </View>
                  <Text style={{ color: theme.textSecondary, fontSize: 13, marginBottom: 6 }}>
                    {order.type} • {order.items?.length} items • Rs. {order.total?.toFixed(0)}
                  </Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {ORDER_STATUSES.map((st) => (
                      <TouchableOpacity
                        key={st}
                        onPress={() => handleStatusChange(order.id, st)}
                        style={[s.statusBtn, { backgroundColor: order.status === st ? STATUS_COLORS[st] : theme.chipBg }]}
                      >
                        <Text style={{ color: order.status === st ? '#fff' : theme.textSecondary, fontSize: 12, fontWeight: '600' }}>{st}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              ))
            )}
          </>
        )}

        {/* RESERVATIONS TAB */}
        {activeTab === 'Reservations' && (
          <>
            <Text style={[s.tabTitle, { color: theme.text }]}>Reservations ({reservations.length})</Text>
            {reservations.length === 0 ? (
              <View style={s.empty}><Text style={{ color: theme.textSecondary }}>No reservations yet.</Text></View>
            ) : (
              reservations.map((r) => (
                <View key={r.id} style={[s.card, { backgroundColor: theme.card }]}>
                  <View style={s.cardHeader}>
                    <Text style={[s.cardId, { color: theme.text }]}>{r.name}</Text>
                    <View style={[s.statusPill, { backgroundColor: r.status === 'confirmed' ? '#27AE6022' : r.status === 'cancelled' ? '#E74C3C22' : '#F39C1222' }]}>
                      <Text style={{ color: r.status === 'confirmed' ? '#27AE60' : r.status === 'cancelled' ? '#E74C3C' : '#F39C12', fontWeight: '700', fontSize: 12 }}>
                        {r.status?.toUpperCase()}
                      </Text>
                    </View>
                  </View>
                  <Text style={{ color: theme.textSecondary, fontSize: 13, marginBottom: 8 }}>
                    📅 {r.date} at {r.time} • 👥 {r.partySize} guests • 📞 {r.contact}
                  </Text>
                  {r.status === 'pending' && (
                    <View style={{ flexDirection: 'row', gap: 10 }}>
                      <TouchableOpacity style={[s.resActionBtn, { backgroundColor: theme.success }]} onPress={() => handleResAction(r.id, 'confirmed')}>
                        <Text style={{ color: '#fff', fontWeight: '700' }}>✅ Accept</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={[s.resActionBtn, { backgroundColor: theme.error }]} onPress={() => handleResAction(r.id, 'declined')}>
                        <Text style={{ color: '#fff', fontWeight: '700' }}>❌ Decline</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              ))
            )}
          </>
        )}

        {/* MENU TAB */}
        {activeTab === 'Menu' && (
          <>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <Text style={[s.tabTitle, { color: theme.text, marginBottom: 0 }]}>Menu Items ({menuItems.length})</Text>
              <TouchableOpacity style={[s.addBtn, { backgroundColor: theme.primary }]} onPress={() => setShowAddModal(true)}>
                <Text style={{ color: '#fff', fontWeight: '700' }}>+ Add Item</Text>
              </TouchableOpacity>
            </View>
            {menuItems.map((item) => (
              <View key={item.id} style={[s.card, { backgroundColor: theme.card }]}>
                <View style={s.cardHeader}>
                  <Text style={[s.cardId, { color: theme.text, flex: 1 }]} numberOfLines={1}>{item.name}</Text>
                  <TouchableOpacity
                    onPress={() => toggleAvailability(item.id)}
                    style={[s.availBtn, { backgroundColor: item.isAvailable ? '#27AE6022' : '#E74C3C22' }]}
                  >
                    <Text style={{ color: item.isAvailable ? '#27AE60' : '#E74C3C', fontSize: 12, fontWeight: '700' }}>
                      {item.isAvailable ? '✅ Available' : '❌ Unavailable'}
                    </Text>
                  </TouchableOpacity>
                </View>
                <Text style={{ color: theme.textSecondary, fontSize: 12, marginBottom: 8 }} numberOfLines={1}>{item.description}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={{ color: theme.textSecondary, marginRight: 8 }}>Price: Rs.</Text>
                  <TextInput
                    style={[s.priceInput, { color: theme.text, borderColor: theme.border, backgroundColor: theme.inputBg }]}
                    value={editingPrice[item.id] !== undefined ? editingPrice[item.id] : String(item.price)}
                    onChangeText={(t) => handlePriceEdit(item.id, t)}
                    keyboardType="numeric"
                    onBlur={() => savePrice(item.id)}
                  />
                  <TouchableOpacity onPress={() => savePrice(item.id)} style={[s.saveBtn, { backgroundColor: theme.primary }]}>
                    <Text style={{ color: '#fff', fontSize: 12, fontWeight: '700' }}>Save</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </>
        )}
      </ScrollView>

      {/* Add Item Modal */}
      <Modal visible={showAddModal} transparent animationType="slide">
        <View style={s.modalOverlay}>
          <View style={[s.modalCard, { backgroundColor: theme.card }]}>
            <Text style={[s.modalTitle, { color: theme.text }]}>Add Menu Item</Text>
            {[['name','Item Name'],['description','Description'],['price','Price (Rs.)']].map(([field, placeholder]) => (
              <TextInput
                key={field}
                style={[s.modalInput, { color: theme.text, borderColor: theme.border, backgroundColor: theme.inputBg }]}
                placeholder={placeholder}
                placeholderTextColor={theme.textLight}
                value={newItem[field]}
                onChangeText={(t) => setNewItem((prev) => ({ ...prev, [field]: t }))}
                keyboardType={field === 'price' ? 'numeric' : 'default'}
                multiline={field === 'description'}
              />
            ))}
            <Text style={{ color: theme.textSecondary, marginBottom: 6, fontWeight: '600' }}>Category</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }}>
              {['starters', 'mains', 'desserts', 'drinks'].map((cat) => (
                <TouchableOpacity key={cat} onPress={() => setNewItem((prev) => ({ ...prev, category: cat }))}
                  style={[s.catChip, { backgroundColor: newItem.category === cat ? theme.primary : theme.chipBg }]}>
                  <Text style={{ color: newItem.category === cat ? '#fff' : theme.text, fontSize: 13, textTransform: 'capitalize' }}>{cat}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <TouchableOpacity style={[s.modalBtn, { borderColor: theme.border, borderWidth: 1 }]} onPress={() => setShowAddModal(false)}>
                <Text style={{ color: theme.textSecondary, fontWeight: '700' }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[s.modalBtn, { backgroundColor: theme.primary }]} onPress={handleAddItem}>
                <Text style={{ color: '#fff', fontWeight: '700' }}>Add Item</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = (theme) => StyleSheet.create({
  container: { flex: 1 },
  tabBar: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: theme.border },
  tabBtn: { flex: 1, padding: 14, alignItems: 'center' },
  tabTitle: { fontSize: 16, fontWeight: '800', marginBottom: 12 },
  empty: { alignItems: 'center', padding: 40 },
  card: {
    borderRadius: 12, padding: 14, marginBottom: 10,
    elevation: 2, shadowColor: theme.shadow, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 3,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  cardId: { fontSize: 15, fontWeight: '700' },
  statusPill: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  statusPillText: { fontSize: 12, fontWeight: '700' },
  statusBtn: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, marginRight: 6 },
  resActionBtn: { flex: 1, padding: 10, borderRadius: 10, alignItems: 'center' },
  addBtn: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10 },
  availBtn: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  priceInput: { borderWidth: 1, borderRadius: 8, padding: 8, width: 80, fontSize: 14 },
  saveBtn: { marginLeft: 8, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 },
  modalOverlay: { flex: 1, backgroundColor: '#00000088', justifyContent: 'flex-end' },
  modalCard: { borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20 },
  modalTitle: { fontSize: 18, fontWeight: '800', marginBottom: 16 },
  modalInput: { borderWidth: 1, borderRadius: 10, padding: 12, marginBottom: 12, fontSize: 14 },
  catChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 16, marginRight: 8 },
  modalBtn: { flex: 1, padding: 14, borderRadius: 12, alignItems: 'center' },
});

export default ManagerDashboardScreen;
