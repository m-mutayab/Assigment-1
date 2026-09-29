export const categories = [
  { id: 'all', name: 'All' },
  { id: 'starters', name: 'Starters' },
  { id: 'mains', name: 'Mains' },
  { id: 'desserts', name: 'Desserts' },
  { id: 'drinks', name: 'Drinks' },
];

export const menuItems = [
  {
    id: 'm1',
    name: 'Crispy Spring Rolls',
    description: 'Golden fried rolls stuffed with veggies and glass noodles, served with sweet chili sauce.',
    price: 450,
    category: 'starters',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400',
    isSpecial: true,
    isAvailable: true,
  },
  {
    id: 'm2',
    name: 'Chicken Tikka Bites',
    description: 'Tender marinated chicken bites grilled to perfection with aromatic spices.',
    price: 650,
    category: 'starters',
    image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400',
    isSpecial: false,
    isAvailable: true,
  },
  {
    id: 'm3',
    name: 'Loaded Nachos',
    description: 'Crispy tortilla chips topped with cheese, jalapeños, sour cream and salsa.',
    price: 550,
    category: 'starters',
    image: 'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=400',
    isSpecial: false,
    isAvailable: false,
  },
  {
    id: 'm4',
    name: 'Grilled BBQ Burger',
    description: 'Juicy beef patty with smoky BBQ sauce, cheddar cheese, lettuce and tomato in a brioche bun.',
    price: 1100,
    category: 'mains',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400',
    isSpecial: true,
    isAvailable: true,
  },
  {
    id: 'm5',
    name: 'Karahi Chicken',
    description: 'Classic Pakistani karahi with tender chicken, tomatoes, green chilies and fresh ginger.',
    price: 1350,
    category: 'mains',
    image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400',
    isSpecial: false,
    isAvailable: true,
  },
  {
    id: 'm6',
    name: 'Beef Biryani',
    description: 'Fragrant basmati rice slow-cooked with tender beef, whole spices, and crispy onions.',
    price: 1200,
    category: 'mains',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400',
    isSpecial: true,
    isAvailable: true,
  },
  {
    id: 'm7',
    name: 'Grilled Salmon',
    description: 'Atlantic salmon fillet grilled with lemon butter, capers and fresh dill.',
    price: 1800,
    category: 'mains',
    image: 'https://images.unsplash.com/photo-1485704686097-ed47f7263ca4?w=400',
    isSpecial: false,
    isAvailable: true,
  },
  {
    id: 'm8',
    name: 'Margherita Pizza',
    description: 'Classic thin-crust pizza with San Marzano tomato sauce, fresh mozzarella and basil.',
    price: 950,
    category: 'mains',
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400',
    isSpecial: false,
    isAvailable: false,
  },
  {
    id: 'm9',
    name: 'Daal Makhani',
    description: 'Creamy black lentils slow-cooked overnight with butter, cream and aromatic spices.',
    price: 750,
    category: 'mains',
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400',
    isSpecial: false,
    isAvailable: true,
  },
  {
    id: 'm10',
    name: 'Chocolate Lava Cake',
    description: 'Warm dark chocolate cake with a gooey molten center, served with vanilla ice cream.',
    price: 550,
    category: 'desserts',
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400',
    isSpecial: true,
    isAvailable: true,
  },
  {
    id: 'm11',
    name: 'Gulab Jamun',
    description: 'Soft milk-solid dumplings soaked in rose-flavored sugar syrup, served warm.',
    price: 350,
    category: 'desserts',
    image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400',
    isSpecial: false,
    isAvailable: true,
  },
  {
    id: 'm12',
    name: 'Mango Cheesecake',
    description: 'Creamy baked cheesecake on a digestive biscuit crust topped with fresh mango coulis.',
    price: 600,
    category: 'desserts',
    image: 'https://images.unsplash.com/photo-1567171466295-4afa63d45416?w=400',
    isSpecial: false,
    isAvailable: true,
  },
  {
    id: 'm13',
    name: 'Fresh Lime Soda',
    description: 'Refreshing chilled soda with freshly squeezed lime juice and a hint of mint.',
    price: 250,
    category: 'drinks',
    image: 'https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=400',
    isSpecial: false,
    isAvailable: true,
  },
  {
    id: 'm14',
    name: 'Mango Lassi',
    description: 'Thick and creamy yogurt-based drink blended with ripe Chaunsa mangoes and cardamom.',
    price: 350,
    category: 'drinks',
    image: 'https://images.unsplash.com/photo-1527661591475-527312dd65f5?w=400',
    isSpecial: true,
    isAvailable: true,
  },
  {
    id: 'm15',
    name: 'Arabic Coffee',
    description: 'Traditional cardamom-infused Arabic coffee served with dates.',
    price: 300,
    category: 'drinks',
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400',
    isSpecial: false,
    isAvailable: true,
  },
  {
    id: 'm16',
    name: 'Strawberry Milkshake',
    description: 'Thick milkshake blended with fresh strawberries and topped with whipped cream.',
    price: 400,
    category: 'drinks',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400',
    isSpecial: false,
    isAvailable: false,
  },
];

export const tables = [
  { id: 't1', tableNumber: 1, seats: 2 },
  { id: 't2', tableNumber: 2, seats: 4 },
  { id: 't3', tableNumber: 3, seats: 4 },
  { id: 't4', tableNumber: 4, seats: 6 },
  { id: 't5', tableNumber: 5, seats: 8 },
  { id: 't6', tableNumber: 6, seats: 2 },
  { id: 't7', tableNumber: 7, seats: 6 },
  { id: 't8', tableNumber: 8, seats: 12 },
];

export const timeSlots = [
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
  '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
  '18:00', '18:30', '19:00', '19:30', '20:00', '20:30',
  '21:00', '21:30', '22:00',
];

export const promoCodes = {
  WELCOME10: { discount: 0.10, label: '10% off' },
  FEAST20: { discount: 0.20, label: '20% off' },
};

export const fetchMenuItems = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() > 0.05) {
        resolve(menuItems);
      } else {
        reject(new Error('Failed to load menu. Please try again.'));
      }
    }, 1500);
  });
};
