import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet,
  ScrollView, TextInput, RefreshControl, ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import { useCart } from '../context/CartContext';
import { useMenu } from '../context/MenuContext';
import { categories, fetchMenuItems } from '../data/menuData';
import MenuItemCard from '../components/MenuItemCard';
import CartBadge from '../components/CartBadge';

const SORT_OPTIONS = [
  { key: 'default', label: 'Default' },
  { key: 'price_asc', label: 'Price ↑' },
  { key: 'price_desc', label: 'Price ↓' },
  { key: 'name_az', label: 'A-Z' },
];

const MenuScreen = () => {
  const { theme } = useTheme();
  const { cartDispatch } = useCart();
  const { menuItems: contextItems } = useMenu();
  const navigation = useNavigation();

  const [menuData, setMenuData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [recentSearches, setRecentSearches] = useState([]);
  const [sort, setSort] = useState('default');
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [renderCount, setRenderCount] = useState(0);

  const searchRef = useRef(null);
  const flatListRef = useRef(null);
  const debounceTimer = useRef(null);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => <CartBadge onPress={() => navigation.navigate('Cart')} />,
    });
  }, [navigation]);

  const loadMenu = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      await fetchMenuItems();
      setMenuData(contextItems);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [contextItems]);

  useEffect(() => {
    loadMenu();
  }, []);

  useEffect(() => {
    if (menuData.length > 0) setMenuData([...contextItems]);
  }, [contextItems]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await new Promise((r) => setTimeout(r, 1000));
    setMenuData([...contextItems]);
    setRefreshing(false);
  }, [contextItems]);

  const handleSearchChange = (text) => {
    setSearchInput(text);
    clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      const trimmed = text.trim();
      setSearch(trimmed);
      if (trimmed && trimmed.length > 1) {
        setRecentSearches((prev) => {
          if (prev[0] === trimmed) return prev;
          const filtered = prev.filter((s) => s !== trimmed);
          return [trimmed, ...filtered].slice(0, 5);
        });
      }
    }, 400);
  };

  const clearSearch = () => {
    setSearchInput('');
    setSearch('');
    clearTimeout(debounceTimer.current);
  };

  const displayedItems = useMemo(() => {
    let items = menuData.filter((item) => {
      const matchCat = selectedCategory === 'all' || item.category === selectedCategory;
      const matchSearch =
        !search ||
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.description.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });

    if (sort === 'price_asc') items = [...items].sort((a, b) => a.price - b.price);
    else if (sort === 'price_desc') items = [...items].sort((a, b) => b.price - a.price);
    else if (sort === 'name_az') items = [...items].sort((a, b) => a.name.localeCompare(b.name));

    setRenderCount((c) => c + 1);
    return items;
  }, [menuData, selectedCategory, search, sort]);

  React.useLayoutEffect(() => {
    navigation.setOptions({ title: `Menu (${displayedItems.length})` });
  }, [displayedItems.length]);

  const handleAddToCart = useCallback((item) => {
    cartDispatch({ type: 'ADD_ITEM', payload: item });
  }, [cartDispatch]);

  const handleScroll = (event) => {
    setShowBackToTop(event.nativeEvent.contentOffset.y > 300);
  };

  const scrollToTop = () => {
    flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
  };

  const s = styles(theme);

  if (loading) {
    return (
      <View style={[s.center, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.primary} />
        <Text style={{ color: theme.textSecondary, marginTop: 12 }}>Loading menu...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[s.center, { backgroundColor: theme.background }]}>
        <Text style={{ fontSize: 32, marginBottom: 12 }}>😕</Text>
        <Text style={{ color: theme.error, fontSize: 16, marginBottom: 16, textAlign: 'center' }}>{error}</Text>
        <TouchableOpacity style={[s.retryBtn, { backgroundColor: theme.primary }]} onPress={loadMenu}>
          <Text style={{ color: '#fff', fontWeight: '700' }}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[s.container, { backgroundColor: theme.background }]}>
      {/* Search */}
      <View style={[s.searchRow, { backgroundColor: theme.surface }]}>
        <TouchableOpacity onPress={() => searchRef.current?.focus()} style={s.searchIcon}>
          <Text>🔍</Text>
        </TouchableOpacity>
        <TextInput
          ref={searchRef}
          style={[s.searchInput, { color: theme.text }]}
          placeholder="Search menu..."
          placeholderTextColor={theme.textLight}
          value={searchInput}
          onChangeText={handleSearchChange}
        />
        {searchInput.length > 0 && (
          <TouchableOpacity onPress={clearSearch} style={s.clearBtn}>
            <Text style={{ color: theme.textLight }}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Recent Searches */}
      {recentSearches.length > 0 && search === '' && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.recentRow}>
          <Text style={[s.recentLabel, { color: theme.textLight }]}>Recent: </Text>
          {recentSearches.map((rs) => (
            <TouchableOpacity
              key={rs}
              onPress={() => { setSearchInput(rs); setSearch(rs); }}
              style={[s.recentChip, { backgroundColor: theme.chipBg }]}
            >
              <Text style={{ color: theme.textSecondary, fontSize: 12 }}>{rs}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {/* Sort */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.sortRow}>
        {SORT_OPTIONS.map((opt) => (
          <TouchableOpacity
            key={opt.key}
            onPress={() => setSort(opt.key)}
            style={[s.sortChip, { backgroundColor: sort === opt.key ? theme.chipActive : theme.chipBg }]}
          >
            <Text style={{ color: sort === opt.key ? theme.chipActiveText : theme.chipText, fontSize: 12, fontWeight: '600' }}>
              {opt.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Categories */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.catRow}>
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat.id}
            onPress={() => setSelectedCategory(cat.id)}
            style={[s.catChip, { backgroundColor: selectedCategory === cat.id ? theme.chipActive : theme.chipBg }]}
          >
            <Text style={{ color: selectedCategory === cat.id ? theme.chipActiveText : theme.chipText, fontWeight: '600' }}>
              {cat.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* List */}
      {displayedItems.length === 0 ? (
        <View style={s.center}>
          <Text style={{ fontSize: 40 }}>🔍</Text>
          <Text style={{ color: theme.textSecondary, fontSize: 16, marginTop: 12 }}>No items found</Text>
          <TouchableOpacity onPress={clearSearch} style={{ marginTop: 8 }}>
            <Text style={{ color: theme.primary }}>Clear Search</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          ref={flatListRef}
          data={displayedItems}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <MenuItemCard item={item} onAdd={handleAddToCart} />}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[theme.primary]} />}
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      )}

      {showBackToTop && (
        <TouchableOpacity style={[s.backToTop, { backgroundColor: theme.primary }]} onPress={scrollToTop}>
          <Text style={{ color: '#fff', fontSize: 12, fontWeight: '700' }}>↑ Top</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = (theme) =>
  StyleSheet.create({
    container: { flex: 1 },
    center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
    retryBtn: { paddingHorizontal: 24, paddingVertical: 12, borderRadius: 10 },
    searchRow: {
      flexDirection: 'row', alignItems: 'center', margin: 12,
      borderRadius: 12, paddingHorizontal: 12, elevation: 2,
      shadowColor: theme.shadow, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 3,
    },
    searchIcon: { marginRight: 8 },
    searchInput: { flex: 1, paddingVertical: 12, fontSize: 15 },
    clearBtn: { padding: 6 },
    recentRow: { paddingHorizontal: 12, marginBottom: 4 },
    recentLabel: { fontSize: 12, alignSelf: 'center', marginRight: 4 },
    recentChip: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, marginRight: 6 },
    sortRow: { paddingHorizontal: 12, marginBottom: 4 },
    sortChip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, marginRight: 6 },
    catRow: { paddingHorizontal: 12, marginBottom: 8 },
    catChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, marginRight: 8 },
    backToTop: {
      position: 'absolute', bottom: 24, right: 20,
      paddingHorizontal: 14, paddingVertical: 10, borderRadius: 20,
      elevation: 4, shadowColor: theme.shadow, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 4,
    },
  });

export default MenuScreen;
