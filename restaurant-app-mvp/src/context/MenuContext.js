import React, { createContext, useContext, useState, useEffect } from 'react';
import { menuItems as initialMenuItems } from '../data/menuData';

const MenuContext = createContext(null);

export const MenuProvider = ({ children }) => {
  const [menuItems, setMenuItems] = useState([...initialMenuItems]);

  const updatePrice = (itemId, newPrice) => {
    setMenuItems((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, price: parseFloat(newPrice) } : item))
    );
  };

  const toggleAvailability = (itemId) => {
    setMenuItems((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, isAvailable: !item.isAvailable } : item
      )
    );
  };

  const addMenuItem = (newItem) => {
    setMenuItems((prev) => [...prev, { ...newItem, id: `m${Date.now()}` }]);
  };

  return (
    <MenuContext.Provider value={{ menuItems, updatePrice, toggleAvailability, addMenuItem }}>
      {children}
    </MenuContext.Provider>
  );
};

export const useMenu = () => {
  const ctx = useContext(MenuContext);
  if (!ctx) throw new Error('useMenu must be used within MenuProvider');
  return ctx;
};

export default MenuContext;
