import { promoCodes } from '../data/menuData';

export const initialCartState = {
  items: [],
  promo: null,
  promoError: '',
};

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const exists = state.items.find((i) => i.id === action.payload.id);
      if (exists) {
        return {
          ...state,
          items: state.items.map((i) =>
            i.id === action.payload.id ? { ...i, quantity: i.quantity + 1 } : i
          ),
        };
      }
      return {
        ...state,
        items: [...state.items, { ...action.payload, quantity: 1, note: '' }],
      };
    }
    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter((i) => i.id !== action.payload) };
    case 'INCREMENT':
      return {
        ...state,
        items: state.items.map((i) =>
          i.id === action.payload ? { ...i, quantity: i.quantity + 1 } : i
        ),
      };
    case 'DECREMENT': {
      const item = state.items.find((i) => i.id === action.payload);
      if (!item) return state;
      if (item.quantity === 1) {
        return { ...state, items: state.items.filter((i) => i.id !== action.payload) };
      }
      return {
        ...state,
        items: state.items.map((i) =>
          i.id === action.payload ? { ...i, quantity: i.quantity - 1 } : i
        ),
      };
    }
    case 'UPDATE_NOTE':
      return {
        ...state,
        items: state.items.map((i) =>
          i.id === action.payload.id ? { ...i, note: action.payload.note } : i
        ),
      };
    case 'CLEAR_CART':
      return initialCartState;
    case 'APPLY_PROMO': {
      const code = action.payload.toUpperCase();
      if (promoCodes[code]) {
        return { ...state, promo: { code, ...promoCodes[code] }, promoError: '' };
      }
      return { ...state, promoError: 'Invalid promo code. Try WELCOME10 or FEAST20.' };
    }
    case 'REMOVE_PROMO':
      return { ...state, promo: null, promoError: '' };
    default:
      return state;
  }
};

export default cartReducer;
