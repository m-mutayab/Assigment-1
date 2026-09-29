import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ReservationsContext = createContext(null);
const STORAGE_KEY = '@restaurant_reservations';

export const ReservationsProvider = ({ children }) => {
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) setReservations(JSON.parse(stored));
      } catch (_) {}
    };
    load();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(reservations)).catch(() => {});
  }, [reservations]);

  const addReservation = (reservation) => {
    const newRes = { ...reservation, id: `r${Date.now()}`, status: 'pending' };
    setReservations((prev) => [newRes, ...prev]);
    return newRes;
  };

  const cancelReservation = (id) => {
    setReservations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'cancelled' } : r))
    );
  };

  const updateReservationStatus = (id, status) => {
    setReservations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status } : r))
    );
  };

  return (
    <ReservationsContext.Provider
      value={{ reservations, addReservation, cancelReservation, updateReservationStatus }}
    >
      {children}
    </ReservationsContext.Provider>
  );
};

export const useReservations = () => {
  const ctx = useContext(ReservationsContext);
  if (!ctx) throw new Error('useReservations must be used within ReservationsProvider');
  return ctx;
};

export default ReservationsContext;
