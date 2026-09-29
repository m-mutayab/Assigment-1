import React, { createContext, useContext, useReducer } from 'react';
import cartReducer, { initialCartState } from '../reducers/cartReducer';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cartState, cartDispatch] = useReducer(cartReducer, initialCartState);

  const totalItems = cartState.items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = cartState.items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider value={{ cartState, cartDispatch, totalItems, subtotal }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};

export default CartContext;
