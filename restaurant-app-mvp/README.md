# 🍽️ Restaurant App MVP

A fully frontend React Native (Expo) application for customers and restaurant managers.  
No backend, no external APIs, no external state-management libraries.

---

## 📋 Features

| Feature | Details |
|---|---|
| Authentication | Login / Signup with validation, role-based navigation |
| Menu Browsing | 16 items, 4 categories, Daily Special badges |
| Search | Debounced (400ms), recent searches, sort by price/name |
| Cart | Reducer-based, promo codes, special instructions |
| Order Summary | Memoized totals, service charge, tax, promo |
| Table Reservation | Custom hooks, Pakistani mobile validation, confirmation modal |
| Order Tracking | Auto status progression (10/20/30 sec), elapsed timer |
| Manager Dashboard | Manage orders, reservations, menu (price & availability) |
| Light / Dark Theme | Shared palette via ThemeContext |
| AsyncStorage | Orders and reservations persist across sessions |

---

## 🚀 Installation

### Requirements
- **Node.js**: v18 or higher
- **npm**: v9 or higher
- **Expo CLI**: installed globally or via `npx`

### Steps

```bash
# 1. Clone or extract the project
cd restaurant-app-mvp

# 2. Install dependencies
npm install

# 3. Start the development server
npx expo start
```

### Running on a Device / Emulator

| Method | Command |
|---|---|
| Expo Go (physical device) | Scan QR code shown in terminal |
| Android Emulator | Press `a` in terminal |
| iOS Simulator (macOS only) | Press `i` in terminal |
| Web | Press `w` in terminal |

---

## 🔐 Mock Credentials

| Role | Email | Password |
|---|---|---|
| 👤 Customer | customer@demo.com | customer123 |
| 👨‍💼 Manager | manager@demo.com | manager123 |

---

## 🪝 Hook-to-Screen Table

| Hook | Screen / Usage |
|---|---|
| `useState` | LoginScreen – form fields, mode toggle, errors |
| `useEffect` | MenuScreen – load menu, cleanup; OrderTrackingScreen – status timers |
| `useRef` | MenuScreen – search input ref, debounce timer, FlatList ref |
| `useContext` | All screens – `useAuth`, `useTheme`, `useCart`, `useOrders`, `useReservations`, `useMenu` |
| `useReducer` | CartContext – cart operations; OrdersContext – order management |
| `useMemo` | OrderSummaryScreen – subtotal, tax, service charge, grand total, sorted items |
| `useCallback` | OrderSummaryScreen – placeOrder, toggleFavourite; MenuScreen – handleAddToCart |
| `React.memo` | MenuItemCard, OrderItemRow – prevent unnecessary re-renders |
| `useForm` (custom) | ReservationScreen – field state, validation, blur/touch |
| `useDebounce` (custom) | Available for use with any debounced input |
| `useReservation` (custom) | ReservationScreen – availability check, modal, confirmation |

---

## 📁 Project Structure

```
restaurant-app-mvp/
├── App.js                        # Root component with all providers
├── app.json                      # Expo config
├── package.json
├── babel.config.js
└── src/
    ├── components/
    │   ├── CartBadge.js          # Live cart count badge
    │   ├── LoadingScreen.js      # Full-screen loading indicator
    │   ├── MenuItemCard.js       # Memoized menu card
    │   └── OrderStatusBar.js     # Progress bar for order status
    ├── context/
    │   ├── AuthContext.js        # currentUser, login, signup, logout
    │   ├── CartContext.js        # Cart state via useReducer
    │   ├── MenuContext.js        # Menu items, price/availability updates
    │   ├── OrdersContext.js      # Orders with AsyncStorage persistence
    │   ├── ReservationsContext.js# Reservations with AsyncStorage
    │   └── ThemeContext.js       # Light/dark theme
    ├── data/
    │   ├── menuData.js           # 16 menu items, categories, tables, promos
    │   ├── theme.js              # Light and dark theme palettes
    │   └── users.js              # Mock user accounts
    ├── hooks/
    │   ├── useDebounce.js        # Generic debounce hook
    │   ├── useForm.js            # Form state, validation, blur/touch
    │   └── useReservation.js     # Reservation business logic
    ├── navigation/
    │   └── AppNavigator.js       # Stack + Bottom Tab navigation
    ├── reducers/
    │   ├── cartReducer.js        # ADD/REMOVE/INCREMENT/DECREMENT/PROMO
    │   └── ordersReducer.js      # ADD_ORDER/UPDATE_STATUS
    └── screens/
        ├── LoginScreen.js        # Auth with validation
        ├── MenuScreen.js         # Browse, search, filter, pull-to-refresh
        ├── CartScreen.js         # Cart management
        ├── OrderSummaryScreen.js # Checkout with bill breakdown
        ├── OrderTrackingScreen.js# Live order status
        ├── ReservationScreen.js  # Book / view reservations
        ├── ProfileScreen.js      # User info, theme toggle, history
        └── ManagerDashboardScreen.js # Manager operations
```

---

## 🎨 Promo Codes

| Code | Discount |
|---|---|
| `WELCOME10` | 10% off subtotal |
| `FEAST20` | 20% off subtotal |

---

## 📱 Screenshots

> Run the app and take screenshots — add them to `/screenshots/` folder.

---

## 🎥 Demo Video

> Record a screen capture of the full flow and add the link here.

---

## ⚙️ Tech Stack

- **React Native** (Expo ~50)
- **React Navigation** v6 (Stack + Bottom Tabs)
- **AsyncStorage** – local persistence
- **Context API** – global state (no Redux/Zustand)
- **React Hooks** – useState, useEffect, useRef, useContext, useReducer, useMemo, useCallback, React.memo
- **Custom Hooks** – useForm, useDebounce, useReservation
