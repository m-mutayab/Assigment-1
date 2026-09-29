import React, { useState } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, TextInput,
  StyleSheet, Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';

const CartScreen = () => {
  const { cartState, cartDispatch, subtotal } = useCart();
  const { theme } = useTheme();
  const navigation = useNavigation();
  const [promoInput, setPromoInput] = useState('');

  const applyPromo = () => {
    cartDispatch({ type: 'APPLY_PROMO', payload: promoInput });
    setPromoInput('');
  };

  const clearCart = () => {
    Alert.alert('Clear Cart', 'Remove all items?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Clear', style: 'destructive', onPress: () => cartDispatch({ type: 'CLEAR_CART' }) },
    ]);
  };

  const s = styles(theme);

  const renderItem = ({ item }) => (
    <View style={s.itemCard}>
      <View style={s.itemTop}>
        <Text style={[s.itemName, { color: theme.text }]} numberOfLines={1}>{item.name}</Text>
        <TouchableOpacity onPress={() => cartDispatch({ type: 'REMOVE_ITEM', payload: item.id })}>
          <Text style={{ color: theme.error, fontSize: 18 }}>🗑️</Text>
        </TouchableOpacity>
      </View>
      <View style={s.itemMiddle}>
        <Text style={[s.itemPrice, { color: theme.primary }]}>Rs. {item.price}</Text>
        <View style={s.stepper}>
          <TouchableOpacity
            style={[s.stepBtn, { backgroundColor: theme.border }]}
            onPress={() => cartDispatch({ type: 'DECREMENT', payload: item.id })}
          >
            <Text style={{ color: theme.text, fontWeight: '700' }}>−</Text>
          </TouchableOpacity>
          <Text style={[s.qty, { color: theme.text }]}>{item.quantity}</Text>
          <TouchableOpacity
            style={[s.stepBtn, { backgroundColor: theme.primary }]}
            onPress={() => cartDispatch({ type: 'INCREMENT', payload: item.id })}
          >
            <Text style={{ color: '#fff', fontWeight: '700' }}>+</Text>
          </TouchableOpacity>
        </View>
        <Text style={[s.lineTotal, { color: theme.text }]}>Rs. {item.price * item.quantity}</Text>
      </View>
      <TextInput
        style={[s.noteInput, { color: theme.text, backgroundColor: theme.inputBg, borderColor: theme.border }]}
        placeholder="Special instructions..."
        placeholderTextColor={theme.textLight}
        value={item.note}
        onChangeText={(text) => cartDispatch({ type: 'UPDATE_NOTE', payload: { id: item.id, note: text } })}
        multiline
      />
    </View>
  );

  if (cartState.items.length === 0) {
    return (
      <View style={[s.empty, { backgroundColor: theme.background }]}>
        <Text style={{ fontSize: 52 }}>🛒</Text>
        <Text style={[s.emptyText, { color: theme.textSecondary }]}>Your cart is empty</Text>
        <TouchableOpacity
          style={[s.browseBtn, { backgroundColor: theme.primary }]}
          onPress={() => navigation.navigate('Menu')}
        >
          <Text style={{ color: '#fff', fontWeight: '700' }}>Browse Menu</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[s.container, { backgroundColor: theme.background }]}>
      <FlatList
        data={cartState.items}
        keyExtractor={(i) => i.id}
        renderItem={renderItem}
        ListFooterComponent={
          <View style={s.footer}>
            {/* Promo */}
            <View style={[s.promoRow, { backgroundColor: theme.card }]}>
              <TextInput
                style={[s.promoInput, { color: theme.text, borderColor: theme.border }]}
                placeholder="Promo code (WELCOME10 / FEAST20)"
                placeholderTextColor={theme.textLight}
                value={promoInput}
                onChangeText={setPromoInput}
                autoCapitalize="characters"
              />
              <TouchableOpacity style={[s.applyBtn, { backgroundColor: theme.primary }]} onPress={applyPromo}>
                <Text style={{ color: '#fff', fontWeight: '700' }}>Apply</Text>
              </TouchableOpacity>
            </View>
            {cartState.promoError ? <Text style={[s.promoError, { color: theme.error }]}>{cartState.promoError}</Text> : null}
            {cartState.promo && (
              <View style={[s.promoApplied, { backgroundColor: '#E8F5E9' }]}>
                <Text style={{ color: '#27AE60', flex: 1 }}>✅ {cartState.promo.code} — {cartState.promo.label}</Text>
                <TouchableOpacity onPress={() => cartDispatch({ type: 'REMOVE_PROMO' })}>
                  <Text style={{ color: theme.error }}>Remove</Text>
                </TouchableOpacity>
              </View>
            )}
            <TouchableOpacity onPress={clearCart} style={s.clearBtn}>
              <Text style={{ color: theme.error, fontWeight: '600' }}>🗑️ Clear Cart</Text>
            </TouchableOpacity>
          </View>
        }
        contentContainerStyle={{ paddingBottom: 20 }}
      />
      <View style={[s.checkoutBar, { backgroundColor: theme.card }]}>
        <View>
          <Text style={[s.totalLabel, { color: theme.textSecondary }]}>Subtotal</Text>
          <Text style={[s.totalAmount, { color: theme.text }]}>Rs. {subtotal.toFixed(0)}</Text>
        </View>
        <TouchableOpacity
          style={[s.checkoutBtn, { backgroundColor: theme.primary }]}
          onPress={() => navigation.navigate('OrderSummary')}
        >
          <Text style={s.checkoutText}>Proceed to Order →</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = (theme) =>
  StyleSheet.create({
    container: { flex: 1 },
    empty: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    emptyText: { fontSize: 16, marginTop: 12, marginBottom: 24 },
    browseBtn: { paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12 },
    itemCard: {
      margin: 12, marginBottom: 6,
      backgroundColor: theme.card, borderRadius: 12, padding: 14,
      elevation: 2, shadowColor: theme.shadow, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 3,
    },
    itemTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
    itemName: { fontSize: 15, fontWeight: '700', flex: 1, marginRight: 8 },
    itemMiddle: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
    itemPrice: { fontSize: 14, fontWeight: '600', flex: 1 },
    stepper: { flexDirection: 'row', alignItems: 'center' },
    stepBtn: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
    qty: { marginHorizontal: 12, fontSize: 16, fontWeight: '700' },
    lineTotal: { fontSize: 14, fontWeight: '700', marginLeft: 12 },
    noteInput: {
      borderWidth: 1, borderRadius: 8, padding: 8,
      fontSize: 13, minHeight: 36,
    },
    footer: { paddingHorizontal: 12 },
    promoRow: { flexDirection: 'row', margin: 4, borderRadius: 10, padding: 8, alignItems: 'center' },
    promoInput: {
      flex: 1, borderWidth: 1, borderRadius: 8, padding: 8,
      fontSize: 13, marginRight: 8,
    },
    applyBtn: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 8 },
    promoError: { fontSize: 12, marginHorizontal: 4, marginTop: 4 },
    promoApplied: {
      flexDirection: 'row', alignItems: 'center',
      padding: 10, borderRadius: 8, margin: 4,
    },
    clearBtn: { alignItems: 'center', marginVertical: 12 },
    checkoutBar: {
      flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
      padding: 16, borderTopWidth: 1, borderTopColor: theme.border,
      elevation: 8,
    },
    totalLabel: { fontSize: 12 },
    totalAmount: { fontSize: 20, fontWeight: '800' },
    checkoutBtn: { paddingHorizontal: 20, paddingVertical: 14, borderRadius: 12 },
    checkoutText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  });

export default CartScreen;
