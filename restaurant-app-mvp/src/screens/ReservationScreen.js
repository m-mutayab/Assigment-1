import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  TextInput, Modal, StyleSheet, Alert, Platform,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useReservations } from '../context/ReservationsContext';
import { useAuth } from '../context/AuthContext';
import useReservation from '../hooks/useReservation';
import useForm from '../hooks/useForm';
import { tables, timeSlots } from '../data/menuData';

const PARTY_SIZES = Array.from({ length: 12 }, (_, i) => i + 1);

const validateRes = (values) => {
  const errors = {};
  if (!values.date) { errors.date = 'Date is required.'; }
  else {
    const s = new Date(values.date);
    const today = new Date(); today.setHours(0,0,0,0);
    if (s < today) errors.date = 'Date cannot be in the past.';
  }
  if (!values.time) { errors.time = 'Please select a time slot.'; }
  else if (values.date) {
    const [h,m] = values.time.split(':').map(Number);
    const slot = new Date(values.date); slot.setHours(h,m,0,0);
    if (slot - new Date() < 3600000) errors.time = 'Booking must be at least 1 hour ahead.';
  }
  if (!values.partySize) errors.partySize = 'Select party size.';
  if (!values.tableId) errors.tableId = 'Select a table.';
  if (!values.name || values.name.trim().length < 2) errors.name = 'Name is required.';
  if (!values.contact || !/^03\d{2}-\d{7}$/.test(values.contact))
    errors.contact = 'Format: 03XX-XXXXXXX';
  return errors;
};

const ReservationScreen = () => {
  const { theme } = useTheme();
  const { reservations, cancelReservation } = useReservations();
  const { currentUser } = useAuth();
  const { loading, showModal, pendingReservation, initiateReservation, confirmReservation, cancelModal } = useReservation();
  const { values, errors, touched, handleChange, handleBlur, handleSubmit, resetForm } = useForm(
    { date: '', time: '', partySize: '', tableId: '', name: currentUser?.name || '', contact: '' },
    validateRes
  );
  const [tab, setTab] = useState('new');

  const myReservations = reservations.filter((r) => r.userId === currentUser?.id);

  const getAvailableTables = (partySize) => {
    if (!partySize) return tables;
    return tables.filter((t) => t.seats >= parseInt(partySize));
  };

  const getTimeSlots = () => {
    if (!values.date) return timeSlots;
    const now = new Date();
    return timeSlots.filter((slot) => {
      const [h, m] = slot.split(':').map(Number);
      const d = new Date(values.date); d.setHours(h, m, 0, 0);
      return d - now >= 3600000;
    });
  };

  const onSubmit = (formValues) => {
    initiateReservation(formValues);
  };

  const handleConfirm = () => {
    confirmReservation();
    resetForm();
  };

  const cancelRes = (id) => {
    Alert.alert('Cancel Reservation', 'Are you sure?', [
      { text: 'No', style: 'cancel' },
      { text: 'Yes, Cancel', style: 'destructive', onPress: () => cancelReservation(id) },
    ]);
  };

  const statusColor = (status) => {
    if (status === 'confirmed') return theme.success;
    if (status === 'cancelled') return theme.error;
    return theme.warning;
  };

  const s = styles(theme);

  // Get today's date string for min date
  const today = new Date().toISOString().split('T')[0];

  return (
    <View style={[s.container, { backgroundColor: theme.background }]}>
      {/* Tabs */}
      <View style={[s.tabRow, { backgroundColor: theme.card }]}>
        {[['new', '+ New Booking'], ['my', '📋 My Reservations']].map(([key, label]) => (
          <TouchableOpacity key={key} style={[s.tab, tab === key && { borderBottomColor: theme.primary, borderBottomWidth: 2 }]} onPress={() => setTab(key)}>
            <Text style={{ color: tab === key ? theme.primary : theme.textSecondary, fontWeight: '700' }}>{label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {tab === 'new' ? (
        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
          {/* Date */}
          <View style={s.field}>
            <Text style={[s.label, { color: theme.textSecondary }]}>Date *</Text>
            <TextInput
              style={[s.input, { color: theme.text, backgroundColor: theme.inputBg, borderColor: errors.date && touched.date ? theme.error : theme.border }]}
              placeholder={`YYYY-MM-DD (min: ${today})`}
              placeholderTextColor={theme.textLight}
              value={values.date}
              onChangeText={(t) => handleChange('date', t)}
              onBlur={() => handleBlur('date')}
            />
            {touched.date && errors.date && <Text style={s.errText}>{errors.date}</Text>}
          </View>

          {/* Time */}
          <View style={s.field}>
            <Text style={[s.label, { color: theme.textSecondary }]}>Time Slot *</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {getTimeSlots().map((slot) => (
                <TouchableOpacity
                  key={slot}
                  style={[s.chip, { backgroundColor: values.time === slot ? theme.primary : theme.chipBg }]}
                  onPress={() => handleChange('time', slot)}
                >
                  <Text style={{ color: values.time === slot ? '#fff' : theme.text, fontSize: 13 }}>{slot}</Text>
                </TouchableOpacity>
              ))}
              {getTimeSlots().length === 0 && (
                <Text style={{ color: theme.textLight, padding: 8 }}>No available slots for this date</Text>
              )}
            </ScrollView>
            {touched.time && errors.time && <Text style={s.errText}>{errors.time}</Text>}
          </View>

          {/* Party Size */}
          <View style={s.field}>
            <Text style={[s.label, { color: theme.textSecondary }]}>Party Size *</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {PARTY_SIZES.map((size) => (
                <TouchableOpacity
                  key={size}
                  style={[s.chip, { backgroundColor: values.partySize == size ? theme.primary : theme.chipBg }]}
                  onPress={() => { handleChange('partySize', size); handleChange('tableId', ''); }}
                >
                  <Text style={{ color: values.partySize == size ? '#fff' : theme.text }}>{size}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            {touched.partySize && errors.partySize && <Text style={s.errText}>{errors.partySize}</Text>}
          </View>

          {/* Table */}
          <View style={s.field}>
            <Text style={[s.label, { color: theme.textSecondary }]}>Table *</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {getAvailableTables(values.partySize).map((table) => (
                <TouchableOpacity
                  key={table.id}
                  style={[s.chip, { backgroundColor: values.tableId === table.id ? theme.primary : theme.chipBg }]}
                  onPress={() => handleChange('tableId', table.id)}
                >
                  <Text style={{ color: values.tableId === table.id ? '#fff' : theme.text, fontWeight: '600' }}>
                    T{table.tableNumber} ({table.seats} seats)
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            {touched.tableId && errors.tableId && <Text style={s.errText}>{errors.tableId}</Text>}
          </View>

          {/* Name */}
          <View style={s.field}>
            <Text style={[s.label, { color: theme.textSecondary }]}>Full Name *</Text>
            <TextInput
              style={[s.input, { color: theme.text, backgroundColor: theme.inputBg, borderColor: errors.name && touched.name ? theme.error : theme.border }]}
              placeholder="Your name"
              placeholderTextColor={theme.textLight}
              value={values.name}
              onChangeText={(t) => handleChange('name', t)}
              onBlur={() => handleBlur('name')}
            />
            {touched.name && errors.name && <Text style={s.errText}>{errors.name}</Text>}
          </View>

          {/* Contact */}
          <View style={s.field}>
            <Text style={[s.label, { color: theme.textSecondary }]}>Contact (03XX-XXXXXXX) *</Text>
            <TextInput
              style={[s.input, { color: theme.text, backgroundColor: theme.inputBg, borderColor: errors.contact && touched.contact ? theme.error : theme.border }]}
              placeholder="0311-1234567"
              placeholderTextColor={theme.textLight}
              value={values.contact}
              onChangeText={(t) => handleChange('contact', t)}
              onBlur={() => handleBlur('contact')}
              keyboardType="phone-pad"
            />
            {touched.contact && errors.contact && <Text style={s.errText}>{errors.contact}</Text>}
          </View>

          <TouchableOpacity style={[s.submitBtn, { backgroundColor: theme.primary }]} onPress={() => handleSubmit(onSubmit)}>
            <Text style={s.submitText}>📅 Book Table</Text>
          </TouchableOpacity>
        </ScrollView>
      ) : (
        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
          {myReservations.length === 0 ? (
            <View style={s.emptyState}>
              <Text style={{ fontSize: 40 }}>📅</Text>
              <Text style={{ color: theme.textSecondary, marginTop: 12 }}>No reservations yet.</Text>
            </View>
          ) : (
            myReservations.map((r) => (
              <View key={r.id} style={[s.resCard, { backgroundColor: theme.card }]}>
                <View style={s.resRow}>
                  <Text style={[s.resDate, { color: theme.text }]}>{r.date} at {r.time}</Text>
                  <View style={[s.statusBadge, { backgroundColor: statusColor(r.status) + '22' }]}>
                    <Text style={[s.statusText, { color: statusColor(r.status) }]}>{r.status.toUpperCase()}</Text>
                  </View>
                </View>
                <Text style={{ color: theme.textSecondary, fontSize: 13 }}>
                  👥 {r.partySize} guests • 📞 {r.contact}
                </Text>
                {r.status === 'pending' && (
                  <TouchableOpacity style={[s.cancelBtn, { borderColor: theme.error }]} onPress={() => cancelRes(r.id)}>
                    <Text style={{ color: theme.error, fontWeight: '600', fontSize: 13 }}>Cancel Reservation</Text>
                  </TouchableOpacity>
                )}
              </View>
            ))
          )}
        </ScrollView>
      )}

      {/* Confirmation Modal */}
      <Modal visible={showModal} transparent animationType="slide">
        <View style={s.modalOverlay}>
          <View style={[s.modalCard, { backgroundColor: theme.card }]}>
            <Text style={[s.modalTitle, { color: theme.text }]}>Confirm Booking</Text>
            {pendingReservation && (
              <>
                <Text style={[s.modalLine, { color: theme.textSecondary }]}>📅 {pendingReservation.date} at {pendingReservation.time}</Text>
                <Text style={[s.modalLine, { color: theme.textSecondary }]}>👥 Party of {pendingReservation.partySize}</Text>
                <Text style={[s.modalLine, { color: theme.textSecondary }]}>🪑 {tables.find(t => t.id === pendingReservation.tableId)?.tableNumber ? `Table ${tables.find(t => t.id === pendingReservation.tableId).tableNumber}` : pendingReservation.tableId}</Text>
                <Text style={[s.modalLine, { color: theme.textSecondary }]}>📞 {pendingReservation.contact}</Text>
              </>
            )}
            <View style={s.modalBtns}>
              <TouchableOpacity style={[s.modalBtn, { borderColor: theme.border }]} onPress={cancelModal}>
                <Text style={{ color: theme.textSecondary, fontWeight: '700' }}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[s.modalBtn, { backgroundColor: theme.primary }]} onPress={handleConfirm}>
                <Text style={{ color: '#fff', fontWeight: '700' }}>Confirm</Text>
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
  tabRow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: theme.border },
  tab: { flex: 1, padding: 14, alignItems: 'center' },
  field: { marginBottom: 16 },
  label: { fontSize: 13, fontWeight: '600', marginBottom: 6 },
  input: { borderWidth: 1, borderRadius: 10, padding: 12, fontSize: 15 },
  errText: { color: theme.error, fontSize: 12, marginTop: 4 },
  chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 16, marginRight: 8 },
  submitBtn: { borderRadius: 12, padding: 16, alignItems: 'center', marginTop: 8 },
  submitText: { color: '#fff', fontWeight: '800', fontSize: 16 },
  emptyState: { alignItems: 'center', marginTop: 60 },
  resCard: {
    borderRadius: 12, padding: 14, marginBottom: 12,
    elevation: 2, shadowColor: theme.shadow, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 3,
  },
  resRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  resDate: { fontSize: 15, fontWeight: '700' },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  statusText: { fontSize: 11, fontWeight: '700' },
  cancelBtn: { borderWidth: 1, borderRadius: 8, padding: 8, alignItems: 'center', marginTop: 10 },
  modalOverlay: { flex: 1, backgroundColor: '#00000088', justifyContent: 'flex-end' },
  modalCard: { borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 24 },
  modalTitle: { fontSize: 20, fontWeight: '800', marginBottom: 16 },
  modalLine: { fontSize: 15, marginBottom: 8 },
  modalBtns: { flexDirection: 'row', gap: 12, marginTop: 20 },
  modalBtn: { flex: 1, padding: 14, borderRadius: 12, alignItems: 'center', borderWidth: 1, borderColor: 'transparent' },
});

export default ReservationScreen;
