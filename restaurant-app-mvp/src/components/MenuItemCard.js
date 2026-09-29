import React, { memo } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';

const MenuItemCard = memo(({ item, onAdd, onFavourite, isFavourite }) => {
  const { theme } = useTheme();

  return (
    <View style={[styles.card, { backgroundColor: theme.card, shadowColor: theme.shadow }]}>
      <Image source={{ uri: item.image }} style={styles.image} resizeMode="cover" />
      <View style={styles.body}>
        <View style={styles.rowBetween}>
          <Text style={[styles.name, { color: theme.text }]} numberOfLines={1}>
            {item.name}
          </Text>
          {item.isSpecial && (
            <View style={[styles.badge, { backgroundColor: theme.secondary }]}>
              <Text style={styles.badgeText}>⭐ Special</Text>
            </View>
          )}
        </View>
        <Text style={[styles.desc, { color: theme.textSecondary }]} numberOfLines={2}>
          {item.description}
        </Text>
        <View style={styles.rowBetween}>
          <Text style={[styles.price, { color: theme.primary }]}>Rs. {item.price}</Text>
          <View style={styles.actions}>
            {onFavourite && (
              <TouchableOpacity onPress={() => onFavourite(item.id)} style={styles.favBtn}>
                <Text style={{ fontSize: 18 }}>{isFavourite ? '❤️' : '🤍'}</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={[
                styles.addBtn,
                { backgroundColor: item.isAvailable ? theme.primary : theme.border },
              ]}
              onPress={() => item.isAvailable && onAdd(item)}
              disabled={!item.isAvailable}
            >
              <Text style={[styles.addText, { color: item.isAvailable ? '#fff' : theme.textLight }]}>
                {item.isAvailable ? '+ Add' : 'Unavailable'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 6,
    flexDirection: 'row',
    overflow: 'hidden',
    elevation: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  image: { width: 100, height: 100 },
  body: { flex: 1, padding: 10 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  name: { fontSize: 15, fontWeight: '700', flex: 1, marginRight: 6 },
  badge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 8 },
  badgeText: { color: '#fff', fontSize: 10, fontWeight: '700' },
  desc: { fontSize: 12, marginVertical: 4, lineHeight: 16 },
  price: { fontSize: 15, fontWeight: '700' },
  actions: { flexDirection: 'row', alignItems: 'center' },
  favBtn: { marginRight: 8 },
  addBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  addText: { fontSize: 13, fontWeight: '600' },
});

export default MenuItemCard;
