import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { colors, spacing, type, radius, shadow } from '../../theme';
import { SearchBar, SectionHeader, ProviderCard, StatusBadge, SummaryCard, TileButton } from '../../components';
import { categories } from '../../data/categories';
import { providers } from '../../data/providers';
import { MainTabParamList, RootStackParamList } from '../../navigation/types';
import { useAuthStore } from '../../store/useAuthStore';
import { useEnquiryStore } from '../../store/useEnquiryStore';
import { useNotificationStore } from '../../store/useNotificationStore';
import { useRequirementStore } from '../../store/useRequirementStore';

type Props = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, 'Dashboard'>,
  NativeStackScreenProps<RootStackParamList>
>;

function greetingForHour(hour: number) {
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  return 'Good Evening';
}

export function DashboardScreen({ navigation }: Props) {
  const profile = useAuthStore((s) => s.profile);
  const enquiries = useEnquiryStore((s) => s.enquiries);
  const unread = useNotificationStore((s) => s.unreadCount());
  const setCategory = useRequirementStore((s) => s.setCategory);

  const firstName = profile.name.split(' ')[0] || 'there';
  const nearby = [...providers].sort((a, b) => a.distanceKm - b.distanceKm).slice(0, 6);
  const popular = [...providers].sort((a, b) => b.reviewCount - a.reviewCount).slice(0, 6);
  const topRated = providers.filter((p) => p.rating >= 4.6).slice(0, 6);
  const activeEnquiries = enquiries.filter((e) => !['completed', 'cancelled'].includes(e.status));
  const awaitingResponse = enquiries.filter((e) => e.status === 'provider_responded').length;
  const visibleActiveEnquiries = activeEnquiries.slice(0, 3);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: spacing.huge }}>
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View style={{ flex: 1 }}>
              <Text style={[type.caption, { color: colors.muted }]}>{greetingForHour(new Date().getHours())} 👋</Text>
              <Text style={[type.h1, { color: colors.ink, marginTop: 2 }]}>{firstName}</Text>
            </View>
            <Pressable
              style={styles.bellBtn}
              onPress={() => navigation.navigate('Notifications')}
              accessibilityRole="button"
              accessibilityLabel="Notifications"
              hitSlop={6}
            >
              <Ionicons name="notifications-outline" size={20} color={colors.ink} />
              {unread > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{unread}</Text>
                </View>
              )}
            </Pressable>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
            <Ionicons name="location" size={12} color={colors.muted} />
            <Text style={[type.caption, { color: colors.muted, marginLeft: 4 }]}>
              {profile.location ? `${profile.location}, ` : ''}{profile.district}
            </Text>
          </View>
        </View>

        <View style={styles.body}>
          <Pressable onPress={() => navigation.navigate('CategorySelect')} accessibilityRole="button" accessibilityLabel="Search providers">
            <View pointerEvents="none">
              <SearchBar value="" onChangeText={() => {}} placeholder="Search catering, decoration, audio..." editable={false} />
            </View>
          </Pressable>

          <SummaryCard
            icon="document-text"
            label={activeEnquiries.length === 1 ? 'Active Enquiry' : 'Active Enquiries'}
            value={activeEnquiries.length}
            meta={awaitingResponse > 0 ? `${awaitingResponse} awaiting your response` : activeEnquiries.length > 0 ? 'All caught up — no action needed' : 'Start by browsing a category below'}
            onPress={() => navigation.navigate('MainTabs', { screen: 'Enquiries' })}
            style={{ marginTop: spacing.lg }}
          />

          <SectionHeader title="Quick Actions" />
          <View style={styles.tileRow}>
            <TileButton
              icon="add-circle"
              label="New Enquiry"
              iconColor={colors.primary}
              onPress={() => navigation.navigate('CategorySelect')}
              style={{ marginRight: spacing.sm }}
            />
            <TileButton
              icon="document-text"
              label="My Enquiries"
              iconColor={colors.secondary}
              onPress={() => navigation.navigate('MainTabs', { screen: 'Enquiries' })}
            />
          </View>

          <SectionHeader title="Browse by Category" />
          <View style={styles.categoryRow}>
            {categories.map((cat, i) => (
              <TileButton
                key={cat.id}
                icon={cat.icon as any}
                label={cat.name}
                iconColor={cat.color}
                onPress={() => {
                  setCategory(cat.id);
                  navigation.navigate('RequirementForm', { category: cat.id });
                }}
                style={i < categories.length - 1 ? { marginRight: spacing.sm } : undefined}
              />
            ))}
          </View>

          {visibleActiveEnquiries.length > 0 && (
            <>
              <SectionHeader title="Active Enquiries" actionLabel="View all" onAction={() => navigation.navigate('MainTabs', { screen: 'Enquiries' })} />
              {visibleActiveEnquiries.map((e) => (
                <Pressable key={e.id} style={[styles.enquiryCard, shadow.sm]} onPress={() => navigation.navigate('EnquiryDetail', { enquiryId: e.id })}>
                  <View style={{ flex: 1 }}>
                    <Text style={[type.bodyMedium, { color: colors.ink }]} numberOfLines={1}>{e.providerName}</Text>
                    <Text style={[type.caption, { color: colors.muted, marginTop: 2 }]}>{e.eventType} · {e.guestCount} guests</Text>
                  </View>
                  <StatusBadge status={e.status} />
                </Pressable>
              ))}
              <View style={{ height: spacing.lg }} />
            </>
          )}

          <SectionHeader title="Nearby Providers" actionLabel="See all" onAction={() => navigation.navigate('CategorySelect')} />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingRight: spacing.xl }}>
            {nearby.map((p) => (
              <View key={p.id} style={{ marginRight: spacing.md }}>
                <ProviderCard provider={p} horizontal onPress={() => navigation.navigate('ProviderDetail', { providerId: p.id })} />
              </View>
            ))}
          </ScrollView>

          <View style={{ height: spacing.xl }} />
          <SectionHeader title="Highly Rated" actionLabel="See all" onAction={() => navigation.navigate('CategorySelect')} />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingRight: spacing.xl }}>
            {topRated.map((p) => (
              <View key={p.id} style={{ marginRight: spacing.md }}>
                <ProviderCard provider={p} horizontal onPress={() => navigation.navigate('ProviderDetail', { providerId: p.id })} />
              </View>
            ))}
          </ScrollView>

          <View style={{ height: spacing.xl }} />
          <SectionHeader title="Popular on Aagara Thirupthi" actionLabel="See all" onAction={() => navigation.navigate('CategorySelect')} />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingRight: spacing.xl }}>
            {popular.map((p) => (
              <View key={p.id} style={{ marginRight: spacing.md }}>
                <ProviderCard provider={p} horizontal onPress={() => navigation.navigate('ProviderDetail', { providerId: p.id })} />
              </View>
            ))}
          </ScrollView>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: { paddingHorizontal: spacing.xl, paddingTop: spacing.sm, paddingBottom: spacing.lg },
  headerTop: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' },
  bellBtn: {
    width: 40, height: 40, borderRadius: radius.md, backgroundColor: colors.surface,
    alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.divider,
  },
  badge: {
    position: 'absolute', top: -3, right: -3, minWidth: 17, height: 17, borderRadius: 9,
    backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 3,
    borderWidth: 1.5, borderColor: colors.background,
  },
  badgeText: { color: colors.white, fontSize: 9, fontWeight: '700' },
  body: { paddingHorizontal: spacing.xl, paddingTop: spacing.sm },
  tileRow: { flexDirection: 'row', marginBottom: spacing.xl },
  categoryRow: { flexDirection: 'row', marginBottom: spacing.xl },
  enquiryCard: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderRadius: radius.lg,
    padding: spacing.md, marginBottom: spacing.sm, borderWidth: 1, borderColor: colors.divider,
  },
});
