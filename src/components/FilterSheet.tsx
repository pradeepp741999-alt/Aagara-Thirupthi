import React, { useState, useEffect } from 'react';
import { View, Text, Modal, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, type, radius } from '../theme';
import { Chip } from './Chip';
import { Button } from './Button';
import { FilterState, defaultFilters } from '../store/useRequirementStore';
import { distanceOptions } from '../data/districts';
import { ServiceCategoryId } from '../data/types';

interface Props {
  visible: boolean;
  onClose: () => void;
  filters: FilterState;
  onApply: (f: FilterState) => void;
  category: ServiceCategoryId;
}

const ratingOptions = [3, 3.5, 4, 4.5];
const sortOptions: { id: FilterState['sortBy']; label: string }[] = [
  { id: 'relevance', label: 'Best Match' },
  { id: 'rating', label: 'Highest Rated' },
  { id: 'distance', label: 'Nearest' },
  { id: 'price_low', label: 'Price: Low to High' },
  { id: 'price_high', label: 'Price: High to Low' },
];

export function FilterSheet({ visible, onClose, filters, onApply, category }: Props) {
  const [local, setLocal] = useState<FilterState>(filters);

  useEffect(() => {
    if (visible) setLocal(filters);
  }, [visible, filters]);

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <SafeAreaView style={styles.sheet} edges={['bottom']}>
          <View style={styles.handle} />
          <View style={styles.headerRow}>
            <Text style={[type.h2, { color: colors.ink }]}>Filters</Text>
            <Pressable onPress={onClose} hitSlop={10}>
              <Ionicons name="close" size={24} color={colors.muted} />
            </Pressable>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: spacing.xl }}>
            <Text style={styles.label}>Sort By</Text>
            <View style={styles.wrapRow}>
              {sortOptions.map((o) => (
                <Chip key={o.id} label={o.label} selected={local.sortBy === o.id} onPress={() => setLocal((s) => ({ ...s, sortBy: o.id }))} style={{ marginRight: 8, marginBottom: 8 }} />
              ))}
            </View>

            <Text style={styles.label}>Distance</Text>
            <View style={styles.wrapRow}>
              {distanceOptions.map((km) => (
                <Chip
                  key={km}
                  label={`Within ${km} km`}
                  selected={local.distanceKm === km}
                  onPress={() => setLocal((s) => ({ ...s, distanceKm: s.distanceKm === km ? undefined : km }))}
                  style={{ marginRight: 8, marginBottom: 8 }}
                />
              ))}
            </View>

            <Text style={styles.label}>Minimum Rating</Text>
            <View style={styles.wrapRow}>
              {ratingOptions.map((r) => (
                <Chip
                  key={r}
                  label={`${r}+ ★`}
                  selected={local.minRating === r}
                  onPress={() => setLocal((s) => ({ ...s, minRating: s.minRating === r ? undefined : r }))}
                  style={{ marginRight: 8, marginBottom: 8 }}
                />
              ))}
            </View>

            {category === 'catering' && (
              <>
                <Text style={styles.label}>Minimum Capacity</Text>
                <View style={styles.wrapRow}>
                  {[100, 300, 500, 1000].map((c) => (
                    <Chip
                      key={c}
                      label={`${c}+ guests`}
                      selected={local.minCapacity === c}
                      onPress={() => setLocal((s) => ({ ...s, minCapacity: s.minCapacity === c ? undefined : c }))}
                      style={{ marginRight: 8, marginBottom: 8 }}
                    />
                  ))}
                </View>

                <Text style={styles.label}>Menu Preference</Text>
                <View style={styles.wrapRow}>
                  <Chip
                    label="Pure Veg Only"
                    icon="leaf"
                    tone="success"
                    selected={!!local.vegOnly}
                    onPress={() => setLocal((s) => ({ ...s, vegOnly: !s.vegOnly }))}
                    style={{ marginRight: 8, marginBottom: 8 }}
                  />
                </View>
              </>
            )}

            <Text style={styles.label}>Availability</Text>
            <View style={styles.wrapRow}>
              <Chip
                label="Available providers only"
                icon="checkmark-circle"
                tone="success"
                selected={!!local.availableOnly}
                onPress={() => setLocal((s) => ({ ...s, availableOnly: !s.availableOnly }))}
                style={{ marginRight: 8, marginBottom: 8 }}
              />
            </View>
          </ScrollView>

          <View style={styles.footerRow}>
            <Button label="Reset" variant="outline" onPress={() => setLocal(defaultFilters)} style={{ flex: 1, marginRight: spacing.sm }} />
            <Button
              label="Apply Filters"
              onPress={() => {
                onApply(local);
                onClose();
              }}
              style={{ flex: 2 }}
            />
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: colors.overlay, justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: colors.background,
    borderTopLeftRadius: radius.xxl,
    borderTopRightRadius: radius.xxl,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.sm,
    maxHeight: '85%',
  },
  handle: { width: 40, height: 4, borderRadius: 2, backgroundColor: colors.border, alignSelf: 'center', marginBottom: spacing.md },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.lg },
  label: { ...type.bodyMedium, color: colors.ink, marginBottom: spacing.sm, marginTop: spacing.md },
  wrapRow: { flexDirection: 'row', flexWrap: 'wrap' },
  footerRow: { flexDirection: 'row', paddingTop: spacing.md, borderTopWidth: 1, borderTopColor: colors.divider },
});
