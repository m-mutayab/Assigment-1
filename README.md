<div align="center">

# 🍽️ Tastique — Restaurant App MVP

**A fully frontend React Native (Expo) app for customers and restaurant managers**

![React Native](https://img.shields.io/badge/React_Native-0.73-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Expo](https://img.shields.io/badge/Expo-50.0-000020?style=for-the-badge&logo=expo&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)
![No Backend](https://img.shields.io/badge/Backend-None-red?style=for-the-badge)

> Browse menus · Reserve tables · Place orders · Track in real-time · Manage as a restaurant manager — all without a backend.

</div>

---

## 📸 Screens At a Glance

| Login | Menu | Cart | Order Tracking |
|:---:|:---:|:---:|:---:|
| 🔐 | 🍽️ | 🛒 | 📦 |
| Role-based auth | Categories + search | Reducer-based | Live status timer |

| Reservation | Profile | Manager Dashboard | Dark Mode |
|:---:|:---:|:---:|:---:|
| 📅 | 👤 | 📊 | 🌙 |
| Custom hooks | Theme toggle | Orders + Menu mgmt | Full palette |

> Add your own screenshots to `/screenshots/` and replace the emoji placeholders above.

---

## ✨ Features

### 👤 Customer
| Feature | Details |
|---|---|
| 🔐 Authentication | Login / Signup with email validation, password strength check, show/hide toggle |
| 🍽️ Menu Browsing | 16 items across 4 categories, Daily Special badges, unavailable item disabling |
| 🔍 Search & Sort | 400ms debounced search, last 5 searches remembered, sort by price / A–Z |
| 🛒 Cart | Add / remove / increment / decrement, special instructions per item, clear cart |
| 🎟️ Promo Codes | `WELCOME10` (10% off) and `FEAST20` (20% off) applied to subtotal |
| 📋 Order Summary | Memoized subtotal, 5% service charge, 15% sales tax, grand total, dine-in / takeaway |
| 📦 Order Tracking | Automatic status flow Pending → Preparing → Ready → Served, elapsed timer |
| 📅 Reservations | Date, time slot, party size, table selection, Pakistani mobile validation, cancellation |
| 👤 Profile | Order history, reservation count, total spent, light/dark theme toggle |

### 👨‍💼 Manager
| Feature | Details |
|---|---|
| 📊 Dashboard | Incoming orders with manual status control |
| 📅 Reservations | Accept or decline pending reservations |
| 🍕 Menu Management | Add new items, edit prices inline, toggle availability (reflects instantly on customer menu) |

### 🌐 App-Wide
| Feature | Details |
|---|---|
| 🌙 Light / Dark Theme | Full palette via `ThemeContext`, switch from Profile screen |
| 💾 Persistence | Orders and reservations saved to `AsyncStorage` |
| 🧭 Navigation | React Navigation v6 — Stack + Bottom Tabs, nested navigators, safe area |

---

## 🚀 Getting Started

### Prerequisites

| Tool | Version |
|---|---|
| Node.js | v18 or higher |
| npm | v9 or higher |
| Expo Go app | Latest (iOS / Android) |

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/YOUR_USERNAME/restaurant-app-mvp.git
cd restaurant-app-mvp

# 2. Install dependencies
npm install

# 3. Start the Expo development server
npx expo start
```

### Running the App

| Platform | How to run |
|---|---|
| 📱 Physical device (iOS / Android) | Install **Expo Go** → scan the QR code in the terminal |
| 🤖 Android Emulator | Press `a` in the terminal (Android Studio required) |
| 🍎 iOS Simulator | Press `i` in the terminal (macOS + Xcode required) |
| 🌐 Web browser | Press `w` in the terminal |

---

## 🔐 Demo Credentials

| Role | Email | Password |
|---|---|---|
| 👤 Customer | `customer@demo.com` | `customer123` |
| 👨‍💼 Manager | `manager@demo.com` | `manager123` |

---

## 🎟️ Promo Codes

| Code | Discount |
|---|---|
| `WELCOME10` | 10% off subtotal |
| `FEAST20` | 20% off subtotal |

Enter at the Cart screen before proceeding to checkout.

---

## 📁 Project Structure

```
restaurant-app-mvp/
├── App.js                            # Root — all context providers stacked here
├── app.json                          # Expo configuration
├── package.json
├── babel.config.js
└── src/
    ├── components/
    │   ├── CartBadge.js              # Live cart item-count badge in header
    │   ├── LoadingScreen.js          # Full-screen centered loading state
    │   ├── MenuItemCard.js           # React.memo card with Add / Favourite
    │   └── OrderStatusBar.js        # 4-step horizontal progress indicator
    │
    ├── context/
    │   ├── AuthContext.js            # currentUser, login(), signup(), logout()
    │   ├── CartContext.js            # Cart state via useReducer + totalItems
    │   ├── MenuContext.js            # Live menu — price & availability updates
    │   ├── OrdersContext.js          # Orders with AsyncStorage persistence
    │   ├── ReservationsContext.js    # Reservations with AsyncStorage persistence
    │   └── ThemeContext.js           # isDark flag, toggleTheme(), theme object
    │
    ├── data/
    │   ├── menuData.js               # 16 items, categories, tables, time slots, promos
    │   ├── theme.js                  # lightTheme and darkTheme palettes
    │   └── users.js                  # Mock user accounts (customer + manager)
    │
    ├── hooks/
    │   ├── useDebounce.js            # Generic value debounce (configurable delay)
    │   ├── useForm.js                # Controlled fields, validation, touched/errors
    │   └── useReservation.js         # Availability check, modal flow, confirmation
    │
    ├── navigation/
    │   └── AppNavigator.js           # Auth gate → CustomerTabs / ManagerTabs → Stacks
    │
    ├── reducers/
    │   ├── cartReducer.js            # ADD_ITEM REMOVE_ITEM INCREMENT DECREMENT
    │   │                             # UPDATE_NOTE CLEAR_CART APPLY_PROMO REMOVE_PROMO
    │   └── ordersReducer.js          # ADD_ORDER UPDATE_ORDER_STATUS SET_ORDERS
    │
    └── screens/
        ├── LoginScreen.js            # useState — form, validation, mock auth delay
        ├── MenuScreen.js             # useState + useEffect + useRef + useMemo
        ├── CartScreen.js             # useCart (useReducer) — full cart management
        ├── OrderSummaryScreen.js     # useMemo + useCallback + React.memo
        ├── OrderTrackingScreen.js    # useEffect — timers, auto-progression, cleanup
        ├── ReservationScreen.js      # useForm + useReservation custom hooks
        ├── ProfileScreen.js          # useContext — auth, theme, orders, reservations
        └── ManagerDashboardScreen.js # useEffect — orders, reservations, menu mgmt
```

---

## 🪝 Hook-to-Screen Reference

| Hook | Where Used | Purpose |
|---|---|---|
| `useState` | `LoginScreen` | Form fields, mode toggle, errors, show-password |
| `useEffect` | `MenuScreen`, `OrderTrackingScreen` | Data load + cleanup; auto-status timers |
| `useRef` | `MenuScreen` | Search input focus, 400ms debounce timer, FlatList scroll ref |
| `useContext` | All screens | `useAuth`, `useTheme`, `useCart`, `useOrders`, `useReservations`, `useMenu` |
| `useReducer` | `CartContext`, `OrdersContext` | Cart actions (8), order actions (3) |
| `useMemo` | `OrderSummaryScreen`, `MenuScreen` | Subtotal, tax, service charge, grand total, filtered/sorted lists |
| `useCallback` | `OrderSummaryScreen`, `MenuScreen` | `placeOrder`, `toggleFavourite`, `handleAddToCart` — stable references |
| `React.memo` | `MenuItemCard`, `OrderItemRow` | Prevent re-render when props unchanged |
| `useForm` *(custom)* | `ReservationScreen` | Controlled fields, blur/touch tracking, validation runner |
| `useDebounce` *(custom)* | Available globally | Returns debounced value after configurable delay |
| `useReservation` *(custom)* | `ReservationScreen` | Availability logic, modal state, confirmation — no business logic in screen |

---

## ⚙️ Tech Stack

| Technology | Version | Role |
|---|---|---|
| React Native | 0.73.4 | UI framework |
| Expo | ~50.0 | Build toolchain & dev server |
| React Navigation | v6 | Stack + Bottom Tab navigation |
| AsyncStorage | 1.21.0 | Local data persistence |
| Context API | built-in | Global state (no Redux / Zustand) |
| React Hooks | built-in | All state and side-effect management |

---

## 📐 Architecture Overview

```
App.js
 └── Providers (ThemeProvider → AuthProvider → MenuProvider → CartProvider → OrdersProvider → ReservationsProvider)
      └── AppNavigator
           ├── LoginScreen          (unauthenticated)
           ├── CustomerTabs         (role: customer)
           │    ├── MenuStack       → Menu → Cart → OrderSummary → OrderTracking
           │    ├── ReservationScreen
           │    └── ProfileScreen
           └── ManagerTabs          (role: manager)
                ├── ManagerDashboardScreen
                ├── MenuStack
                └── ProfileScreen
```

---

## 🔧 Functional Requirements Coverage

All 67 functional requirements from the SRS are implemented:

- **FR-01 to FR-09** — Authentication (login/signup, validation, delay, ActivityIndicator, role navigation)
- **FR-10 to FR-20** — Menu (16 items, categories, FlatList, Special badge, pull-to-refresh, header count)
- **FR-21 to FR-28** — Search (ref focus, 400ms debounce, last 5 searches, empty state, Back to Top, sort)
- **FR-29 to FR-38** — Cart (add/increment/decrement/remove/notes/clear, WELCOME10 & FEAST20 promo, badge)
- **FR-39 to FR-47** — Reservation (time slots 12–22, party 1–12, past-date rejection, 03XX-XXXXXXX validation, 1hr ahead, modal, My Reservations, cancellation)
- **FR-48 to FR-57** — Orders (Dine-in/Takeaway, table/pickup required, auto Pending→Preparing→Ready→Served at 10/20/30s, elapsed timer, interval cleanup)
- **FR-58 to FR-67** — Manager Dashboard (orders, status change, reservation accept/decline, add item, edit price, toggle availability, instant menu sync)

---

## 📝 License

MIT © 2024 — free to use, modify, and distribute.

---

<div align="center">
  Made with ❤️ using React Native + Expo
</div>
