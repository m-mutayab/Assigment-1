import { useState } from 'react';
import { tables, timeSlots } from '../data/menuData';
import { useReservations } from '../context/ReservationsContext';
import { useAuth } from '../context/AuthContext';

const PAKISTANI_MOBILE_REGEX = /^03\d{2}-\d{7}$/;

const validateReservation = (values) => {
  const errors = {};
  if (!values.date) errors.date = 'Date is required.';
  else {
    const selected = new Date(values.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selected < today) errors.date = 'Date cannot be in the past.';
  }
  if (!values.time) errors.time = 'Please select a time slot.';
  else {
    const now = new Date();
    const [h, m] = values.time.split(':').map(Number);
    const slotDate = values.date ? new Date(values.date) : new Date();
    slotDate.setHours(h, m, 0, 0);
    const diffMs = slotDate - now;
    if (diffMs < 60 * 60 * 1000) errors.time = 'Booking must be at least 1 hour ahead.';
  }
  if (!values.partySize || values.partySize < 1 || values.partySize > 12)
    errors.partySize = 'Party size must be between 1 and 12.';
  if (!values.tableId) errors.tableId = 'Please select a table.';
  if (!values.name || values.name.trim().length < 2) errors.name = 'Name is required.';
  if (!values.contact || !PAKISTANI_MOBILE_REGEX.test(values.contact))
    errors.contact = 'Enter a valid Pakistani mobile number (03XX-XXXXXXX).';
  return errors;
};

const useReservation = () => {
  const { addReservation } = useReservations();
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [pendingReservation, setPendingReservation] = useState(null);

  const getAvailableTables = (partySize) => {
    return tables.filter((t) => t.seats >= partySize);
  };

  const getAvailableSlots = (date) => {
    if (!date) return timeSlots;
    const now = new Date();
    return timeSlots.filter((slot) => {
      const [h, m] = slot.split(':').map(Number);
      const slotDate = new Date(date);
      slotDate.setHours(h, m, 0, 0);
      return slotDate - now >= 60 * 60 * 1000;
    });
  };

  const initiateReservation = (values) => {
    const errors = validateReservation(values);
    if (Object.keys(errors).length > 0) return errors;
    setPendingReservation({ ...values, userId: currentUser?.id });
    setShowModal(true);
    return {};
  };

  const confirmReservation = () => {
    if (!pendingReservation) return;
    setLoading(true);
    setTimeout(() => {
      addReservation(pendingReservation);
      setLoading(false);
      setShowModal(false);
      setPendingReservation(null);
    }, 800);
  };

  const cancelModal = () => {
    setShowModal(false);
    setPendingReservation(null);
  };

  return {
    loading,
    showModal,
    pendingReservation,
    getAvailableTables,
    getAvailableSlots,
    initiateReservation,
    confirmReservation,
    cancelModal,
    validateReservation,
  };
};

export default useReservation;
