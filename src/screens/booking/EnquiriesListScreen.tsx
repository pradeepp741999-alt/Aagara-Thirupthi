import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { colors, spacing, type, radius, shadow } from '../../theme';
import { Chip, StatusBadge, EmptyState } from '../../components';
import { useEnquiryStore } from '../../store/useEnquiryStore';
import { MainTabParamList, RootStackParamList } from '../../navigation/types';
import { categories } from '../../data/categories';
import { formatLongDate } from '../../utils/date';
import { formatCurrency } from '../../utils/currency';
import { Enquiry } from '../../data/types';

type Props = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, 'Enquiries'>,
  NativeStackScreenProps<RootStackParamList>
>;

type FilterTab = 'active' | 'completed' | 'cancelled';

export function EnquiriesListScreen({ navigation }: Props) {
  const enquiries = useEnquiryStore((s) => s.enquiries);
  const [tab, setTab] = useState<FilterTab>('active');

  const filtered = useMemo(() => {
    return enquiries.filter((e) => {
      if (tab === 'active') return !['completed', 'cancelled'].includes(e.status);
      if (tab === 'completed') return e.status === 'completed';
      return e.status === 'cancelled';
    });
  }, [enquiries, tab]);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Text style={[type.h1, { color: colors.ink }]}>My Enquiries</Text>
        <Text style={[type.body, { color: colors.muted, marginTop: 4 }]}>Track responses & bookings across all providers</Text>
      </View>

      <View style={styles.tabRow}>
        <Chip label="Active" selected={tab === 'active'} onPress={() => setTab('active')} style={{ marginRight: 8 }} />
        <Chip label="Completed" selected={tab === 'completed'} onPress={() => setTab('completed')} style={{ marginRight: 8 }} />
        <Chip label="Cancelled" selected={tab === 'cancelled'} onPress={() => setTab('cancelled')} />
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(e) => e.id}
        contentContainerStyle={{ padding: spacing.xl, paddingTop: spacing.sm }}
        renderItem={({ item }) => <EnquiryCard enquiry={item} onPress={() => navigation.navigate('EnquiryDetail', { enquiryId: item.id })} />}
        ListEmptyComponent={
          <EmptyState
            icon="document-text-outline"
            title="Nothing here yet"
            message="Enquiries you send to providers will show up here so you can track responses."
            actionLabel="Browse Providers"
            onAction={() => navigation.navigate('CategorySelect')}
          />
        }
      />
    </SafeAreaView>
  );
}

function EnquiryCard({ enquiry, onPress }: { enquiry: Enquiry; onPress: () => void }) {
  const catMeta = categories.find((c) => c.id === enquiry.category);
  return (
    <Pressable style={[styles.card, shadow.sm]} onPress={onPress}>
      <View style={[styles.catIcon, { backgroundColor: (catMeta?.color ?? colors.primary) + '20' }]}>
        <Ionicons name={(catMeta?.icon as any) ?? 'briefcase'} size={20} color={catMeta?.color ?? colors.primary} />
      </View>
      <View style={{ flex: 1, marginLeft: spacing.md }}>
        <Text style={[type.bodyMedium, { color: colors.ink }]} numberOfLines={1}>{enquiry.providerName}</Text>
        <Text style={[type.caption, { color: colors.muted, marginTop: 2 }]}>
          {enquiry.eventType} · {enquiry.guestCount} guests · {formatLongDate(enquiry.eventDate)}
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 6 }}>
          <StatusBadge status={enquiry.status} />
          {enquiry.status === 'completed' && !enquiry.hasReview && (
            <Text style={[type.tiny, { color: colors.primary, marginLeft: 8 }]}>Tap to review</Text>
          )}
        </View>
      </View>
      <View style={{ alignItems: 'flex-end' }}>
        {(enquiry.providerQuote ?? enquiry.estimatedTotal) > 0 && (
          <Text style={[type.bodyMedium, { color: colors.ink }]}>
            {formatCurrency(enquiry.providerQuote ?? enquiry.estimatedTotal)}
          </Text>
        )}
        <Ionicons name="chevron-forward" size={18} color={colors.faint} style={{ marginTop: 4 }} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: { paddingHorizontal: spacing.xl, paddingTop: spacing.md },
  tabRow: { flexDirection: 'row', paddingHorizontal: spacing.xl, marginTop: spacing.lg },
  card: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderRadius: radius.xl,
    borderWidth: 1, borderColor: colors.divider, padding: spacing.md, marginBottom: spacing.md,
  },
  catIcon: { width: 44, height: 44, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center' },
});
