import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { colors, spacing, type } from '../../theme';
import { SearchBar, Chip, ProviderCard, EmptyState } from '../../components';
import { providers } from '../../data/providers';
import { categories } from '../../data/categories';
import { MainTabParamList, RootStackParamList } from '../../navigation/types';
import { useRequirementStore } from '../../store/useRequirementStore';
import { ServiceCategoryId } from '../../data/types';

type Props = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, 'Explore'>,
  NativeStackScreenProps<RootStackParamList>
>;

export function ExploreScreen({ navigation }: Props) {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<ServiceCategoryId | 'all'>('all');
  const setCategory = useRequirementStore((s) => s.setCategory);

  const results = useMemo(() => {
    let list = providers;
    if (activeCategory !== 'all') list = list.filter((p) => p.category === activeCategory);
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(q) || p.tagline.toLowerCase().includes(q));
    }
    return [...list].sort((a, b) => b.rating - a.rating);
  }, [activeCategory, query]);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Text style={[type.h1, { color: colors.ink }]}>Explore Providers</Text>
        <Text style={[type.body, { color: colors.muted, marginTop: 4 }]}>Browse every provider on Aagara Thirupthi</Text>
      </View>

      <View style={styles.searchWrap}>
        <SearchBar value={query} onChangeText={setQuery} placeholder="Search by provider name..." />
      </View>

      <View style={styles.chipRow}>
        <Chip label="All" selected={activeCategory === 'all'} onPress={() => setActiveCategory('all')} style={{ marginRight: 8 }} />
        {categories.map((c) => (
          <Chip key={c.id} label={c.name} icon={c.icon as any} selected={activeCategory === c.id} onPress={() => setActiveCategory(c.id)} style={{ marginRight: 8 }} />
        ))}
      </View>

      <FlatList
        data={results}
        keyExtractor={(p) => p.id}
        contentContainerStyle={{ padding: spacing.xl, paddingTop: spacing.sm }}
        renderItem={({ item }) => (
          <View style={{ marginBottom: spacing.md }}>
            <ProviderCard
              provider={item}
              onPress={() => {
                setCategory(item.category);
                navigation.navigate('ProviderDetail', { providerId: item.id });
              }}
            />
          </View>
        )}
        ListEmptyComponent={
          <EmptyState icon="search" title="No providers found" message="Try a different search term or category." />
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: { paddingHorizontal: spacing.xl, paddingTop: spacing.md },
  searchWrap: { paddingHorizontal: spacing.xl, marginTop: spacing.lg, marginBottom: spacing.md },
  chipRow: { flexDirection: 'row', paddingHorizontal: spacing.xl, marginBottom: spacing.sm, flexWrap: 'wrap' },
});
