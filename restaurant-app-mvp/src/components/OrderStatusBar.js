import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';

const STATUSES = ['Pending', 'Preparing', 'Ready', 'Served'];

const OrderStatusBar = ({ status }) => {
  const { theme } = useTheme();
  const currentIndex = STATUSES.indexOf(status);

  return (
    <View style={styles.container}>
      {STATUSES.map((s, i) => {
        const done = i <= currentIndex;
        return (
          <View key={s} style={styles.step}>
            <View
              style={[
                styles.circle,
                { backgroundColor: done ? theme.primary : theme.border, borderColor: done ? theme.primary : theme.border },
              ]}
            >
              <Text style={{ color: done ? '#fff' : theme.textLight, fontSize: 12, fontWeight: '700' }}>
                {i + 1}
              </Text>
            </View>
            <Text style={[styles.label, { color: done ? theme.primary : theme.textLight }]}>{s}</Text>
            {i < STATUSES.length - 1 && (
              <View style={[styles.line, { backgroundColor: i < currentIndex ? theme.primary : theme.border }]} />
            )}
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'center', paddingVertical: 12 },
  step: { alignItems: 'center', flex: 1, position: 'relative' },
  circle: {
    width: 30, height: 30, borderRadius: 15,
    borderWidth: 2, alignItems: 'center', justifyContent: 'center',
  },
  label: { fontSize: 10, marginTop: 4, textAlign: 'center', fontWeight: '600' },
  line: {
    position: 'absolute', top: 14, left: '50%', right: '-50%', height: 2,
  },
});

export default OrderStatusBar;
