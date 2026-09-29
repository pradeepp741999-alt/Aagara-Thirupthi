import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { colors, spacing, type, radius } from '../../theme';
import { ScreenHeader, SearchBar, Chip, EmptyState, FilterSheet } from '../../components';
import { ProviderCard } from '../../components/ProviderCard';
import { providers } from '../../data/providers';
import { RootStackParamList } from '../../navigation/types';
import { useRequirementStore } from '../../store/useRequirementStore';
import { filterProviders } from '../../utils/filterProviders';
import { formatLongDate } from '../../utils/date';
import { categories } from '../../data/categories';

type Props = NativeStackScreenProps<RootStackParamList, 'SearchResults'>;

export function SearchResultsScreen({ navigation }: Props) {
  const requirement = useRequirementStore((s) => s.requirement);
  const filters = useRequirementStore((s) => s.filters);
  const updateFilters = useRequirementStore((s) => s.updateFilters);
  const searchQuery = useRequirementStore((s) => s.searchQuery);
  const setSearchQuery = useRequirementStore((s) => s.setSearchQuery);
  const [filterVisible, setFilterVisible] = useState(false);

  const catMeta = categories.find((c) => c.id === requirement.category)!;
  const results = useMemo(
    () => filterProviders(providers, requirement, filters, searchQuery),
    [requirement, filters, searchQuery]
  );

  const activeFilterCount = [
    filters.distanceKm, filters.minRating, filters.minCapacity, filters.vegOnly, filters.availableOnly,
  ].filter(Boolean).length;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScreenHeader title={`${catMeta.name} Providers`} onBack={() => navigation.goBack()} />

      <View style={styles.searchWrap}>
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder={`Search ${catMeta.name.toLowerCase()} providers or dishes...`}
          onFilterPress={() => setFilterVisible(true)}
          filterActive={activeFilterCount > 0}
        />
      </View>

      <View style={styles.summaryRow}>
        <Ionicons name="location" size={13} color={colors.primary} />
        <Text style={[type.caption, { color: colors.body, marginLeft: 4 }]} numberOfLines={1}>
          {requirement.district}{requirement.location ? `, ${requirement.location}` : ''} · {requirement.guestCount} guests
          {requirement.eventDate ? ` · ${formatLongDate(requirement.eventDate)}` : ''}
        </Text>
      </View>

      {activeFilterCount > 0 && (
        <View style={styles.activeFiltersRow}>
          {filters.distanceKm && <Chip label={`Within ${filters.distanceKm} km`} tone="info" onPress={() => updateFilters({ distanceKm: undefined })} style={{ marginRight: 6 }} />}
          {filters.minRating && <Chip label={`${filters.minRating}+ ★`} tone="info" onPress={() => updateFilters({ minRating: undefined })} style={{ marginRight: 6 }} />}
          {filters.minCapacity && <Chip label={`${filters.minCapacity}+ guests`} tone="info" onPress={() => updateFilters({ minCapacity: undefined })} style={{ marginRight: 6 }} />}
          {filters.vegOnly && <Chip label="Pure Veg" tone="success" onPress={() => updateFilters({ vegOnly: false })} style={{ marginRight: 6 }} />}
          {filters.availableOnly && <Chip label="Available Only" tone="success" onPress={() => updateFilters({ availableOnly: false })} style={{ marginRight: 6 }} />}
        </View>
      )}

      <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        numColumns={1}
        contentContainerStyle={{ padding: spacing.xl, paddingTop: spacing.sm }}
        renderItem={({ item }) => (
          <View style={{ marginBottom: spacing.md }}>
            <ProviderCard provider={item} onPress={() => navigation.navigate('ProviderDetail', { providerId: item.id })} />
          </View>
        )}
        ListHeaderComponent={
          <Text style={[type.caption, { color: colors.muted, marginBottom: spacing.md }]}>
            {results.length} provider{results.length !== 1 ? 's' : ''} found
          </Text>
        }
        ListEmptyComponent={
          <EmptyState
            icon="search"
            title="No providers match yet"
            message="Try widening your distance filter or clearing some filters to see more providers."
            actionLabel="Clear Filters"
            onAction={() => updateFilters({ distanceKm: undefined, minRating: undefined, minCapacity: undefined, vegOnly: false, availableOnly: false })}
          />
        }
      />

      <FilterSheet
        visible={filterVisible}
        onClose={() => setFilterVisible(false)}
        filters={filters}
        onApply={updateFilters}
        category={requirement.category}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  searchWrap: { paddingHorizontal: spacing.xl, marginBottom: spacing.sm },
  summaryRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.xl, marginBottom: spacing.sm },
  activeFiltersRow: { flexDirection: 'row', paddingHorizontal: spacing.xl, marginBottom: spacing.sm, flexWrap: 'wrap' },
});
