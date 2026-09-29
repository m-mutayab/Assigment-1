import React, { createContext, useContext, useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ordersReducer, { initialOrdersState } from '../reducers/ordersReducer';

const OrdersContext = createContext(null);
const STORAGE_KEY = '@restaurant_orders';

export const OrdersProvider = ({ children }) => {
  const [ordersState, ordersDispatch] = useReducer(ordersReducer, initialOrdersState);

  useEffect(() => {
    const load = async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
          ordersDispatch({ type: 'SET_ORDERS', payload: JSON.parse(stored) });
        }
      } catch (_) {}
    };
    load();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(ordersState.orders)).catch(() => {});
  }, [ordersState.orders]);

  return (
    <OrdersContext.Provider value={{ ordersState, ordersDispatch }}>
      {children}
    </OrdersContext.Provider>
  );
};

export const useOrders = () => {
  const ctx = useContext(OrdersContext);
  if (!ctx) throw new Error('useOrders must be used within OrdersProvider');
  return ctx;
};

export default OrdersContext;
